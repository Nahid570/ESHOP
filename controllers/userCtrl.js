const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const generateJWT_Token = require("../config/jwtToken");
const validatemongoId = require("../utils/validateMongoId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

exports.createUser = asyncHandler(async (req, res) => {
  const email = req?.body?.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    res.json({ message: "User already exists!", success: false });
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.validatePassword(password))) {
    const refreshToken = await generateRefreshToken(findUser._id);
    await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      secure: false,
    });
    res.json({
      _id: findUser._id,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email: findUser.email,
      token: generateJWT_Token(findUser.id),
    });
  } else {
    throw new Error("Invalid credential");
  }
});

exports.handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req?.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token set to header");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("Invalid/No refresh token found");
  await jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
    const objectId = user._id;
    const id = objectId.toString();
    if (err || user.id !== decode.id) {
      throw new Error("Something wrong with refresh token");
    }
    const accessToken = generateJWT_Token(user?._id);
    res.json({ accessToken });
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({refreshToken}, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validatemongoId(_id);
  try {
    const update_user = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
      },
      {
        new: true,
      }
    );

    res.json(update_user);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  validatemongoId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  validatemongoId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

exports.blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    if (block === null) throw new Error("User not Found!");
    res.json({ message: "User Blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

exports.unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    if (unblock === null) throw new Error("User not Found!");
    res.json({ message: "User Unblocked" });
  } catch (error) {
    throw new Error(error);
  }
});
