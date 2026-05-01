const error = require("../../common/error.js");
const success = require("../../common/success.js");
const { getUserModel } = require("../../models/users/userModel.js");

const getProfileCtr = async (req, res) => {
  //fetch user from database using req.user.sub (phone number)
  try {
    const data = await getUserModel(req.user);
    const user = data[0];
    if (!user) {
      return res
        .status(404)
        .json(
          error(
            "User Not Found",
            "No user found with the provided credentials.",
          ),
        );
    }

    // fetch balance from wallet service
    //fetch followers and following count
    //
    // return user data along with balance

    res.json(
      success(
        {
          full_name: user.full_name,
          dob: user.dob,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
          pic: user.pic,
          banner_pic: user.banner,
          role: user.role,
          position: user.position,
          //   followers_count: user.followers_count,
          //   following_count: user.following_count,
          //   balance: user.balance,
          //   gold: user.gold,
          played_match: user.played_match,
          wonned_match: user.winned_match,
          life_time_value: user.life_time_value,
          monthly_value: user.monthly_value,
          lastmonth_value: user.lastmonth_value,
          uid: user.uid,
          game_id_name: user.game_id_name,
          username: user.user_name,
          created_time: user.created_time,
        },
        "Profile data fetched successfully.",
      ),
    );
  } catch (err) {
    return res
      .status(500)
      .json(
        error("Server Error", "An error occurred while fetching user data."),
      );
  }
  //   res.json({ success: true, user });
};

const getUserProfile = async (req, res) => {
  const { phone, username } = req.query;

  try {
    let data = {};
    if (phone) {
      data = await getUserModel({ phone });
    } else if (username) {
      data = await getUserModel({ username });
    } else {
      return res
        .status(400)
        .json(
          error(
            "Invalid Request",
            "Phone number or username is required to fetch profile.",
          ),
        );
    }

    if (!user) {
      return res
        .status(404)
        .json(
          error(
            "User Not Found",
            "No user found with the provided phone number.",
          ),
        );
    }

    res.json(
      success(
        {
          full_name: user.full_name,
          dob: user.dob,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
          pic: user.pic,
          banner_pic: user.banner,
          role: user.role,
          played_match: user.played_match,
          wonned_match: user.winned_match,
          life_time_value: user.life_time_value,
          monthly_value: user.monthly_value,
          lastmonth_value: user.lastmonth_value,
          uid: user.uid,
          game_id_name: user.game_id_name,
          username: user.user_name,
          created_time: user.created_time,
        },
        "User profile data fetched successfully.",
      ),
    );
  } catch (err) {
    return res
      .status(500)
      .json(
        error(
          "Server Error",
          "An error occurred while fetching user profile data.",
        ),
      );
  }
};

module.exports = {
  getProfileCtr,
  getUserProfile,
};
