const User = require("../models/User");

// ─────────────────────────────────────────────
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
// ─────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────────────────────
// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
// ─────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────────────────────
// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
// ─────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────────────────────
// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {

    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────────────────────
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
// ─────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ─────────────────────────────────────────────
// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
// ─────────────────────────────────────────────
const updateUserRole = async (req, res) => {
  try {

    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated",
      data: user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserProfile,
  updateProfile,
  deleteUser,
  updateUserRole,
};