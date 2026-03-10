const error = require("../../common/error.js");
const success = require("../../common/success.js");
const { getUserModel } = require("../../models/users/userModel.js");

const getProfileCtr = async (req, res) => {
  //fetch user from database using req.user.sub (phone number)
  try {
    const user = await getUserModel(req.user);
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
    console.error("Error fetching user:", err);
    return res
      .status(500)
      .json(
        error("Server Error", "An error occurred while fetching user data."),
      );
  }
  //   res.json({ success: true, user });
};

module.exports = {
  getProfileCtr,
};
