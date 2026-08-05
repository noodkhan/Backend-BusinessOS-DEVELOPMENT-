const { S3Client, PutObjectCommand , DeleteObjectCommand } = require("@aws-sdk/client-s3");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Partner = require("../../models/user/partner"); // เพิ่มบรรทัดนี้
const Member = require("../../models/user/member");
const Course = require("../../models/course");
const Round = require("../../models/round");

const multer = require("multer");

const storage = multer.memoryStorage();
exports.upload = multer({ storage });

// ตั้งค่า AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


// ฟังก์ชันสร้าง memberId (เปลี่ยนจาก P เป็น M)
const generateMemberId = async () => {
  const lastMember = await Member.findOne({}, {}, { sort: { createdAt: -1 } });

  let lastId = 0;
  if (lastMember && lastMember.memberId) {
    const numberPart = lastMember.memberId.replace(/^M/, "");
    if (!isNaN(numberPart)) {
      lastId = parseInt(numberPart);
    } else {
      console.warn("Invalid memberId format:", lastMember.memberId);
    }
  }

  return "M" + String(lastId + 1).padStart(6, "0");
};

// ฟังก์ชันตรวจสอบข้อมูลที่ซ้ำ
const checkDuplicate = async (field, value) => {
  const [memberUser, partnerUser] = await Promise.all([
    Member.findOne({ [field]: value }),
    Partner.findOne({ [field]: value }),
  ]);
  return { exists: !!memberUser || !!partnerUser };
};

// สมัครสมาชิก Member
exports.registerMember = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ตรวจสอบข้อมูลที่ต้องไม่ซ้ำ
    const checks = await Promise.all([
      checkDuplicate("username", req.body.username),
      checkDuplicate("personalId", req.body.personalId),
      checkDuplicate("personalPhone", req.body.personalPhone),
      checkDuplicate("personalEmail", req.body.personalEmail),
    ]);

    const conflicts = {
      username: checks[0].exists,
      personalId: checks[1].exists,
      personalPhone: checks[2].exists,
      personalEmail: checks[3].exists,
    };

    const conflictNames = [];
    if (conflicts.username) conflictNames.push("ชื่อผู้ใช้");
    if (conflicts.personalId) conflictNames.push("เลขบัตรประชาชน");
    if (conflicts.personalPhone) conflictNames.push("เบอร์โทรศัพท์ส่วนตัว");
    if (conflicts.personalEmail) conflictNames.push("อีเมลส่วนตัว");

    if (conflictNames.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: "ข้อมูลซ้ำกับในระบบ",
        fields: conflicts,
        conflictNames,
      });
    }

    // สร้าง memberId
    const memberId = await generateMemberId();

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // สร้างข้อมูล Member
    const newMember = new Member({
      username: req.body.username,
      password: hashedPassword,
      role: "member",
      memberId: memberId,
      title: req.body.title,
      fullName: req.body.fullName,
      personalId: req.body.personalId,
      personalPhone: req.body.personalPhone,
      personalEmail: req.body.personalEmail,
      personalAddress: req.body.personalAddress,
      personalProvince: req.body.personalProvince,
      personalDistrict: req.body.personalDistrict,
      personalSubdistrict: req.body.personalSubdistrict,
      personalPostalCode: req.body.personalPostalCode,
      profile_img: "",
    });

    await newMember.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ",
      memberId: memberId,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error registering member:", error);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      details: error.message,
    });
  }
};

// ดึงข้อมูลโปรไฟล์ (ไม่ใช้ req.user)
exports.getProfile = async (req, res) => {
  try {
    const { memberId } = req.query;

    if (!memberId) {
      return res.status(400).json({ error: "Member ID is required" });
    }

    const member = await Member.findOne({ memberId }).select(
      "-password -token"
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};


exports.getProfileByID = async (req , res ) => {
  const memberId = req.params.id;
  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      member
    });
  } catch (err) {
    console.error('❌ Error fetching member profile:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Update user profile using params ID
exports.updateProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      personalEmail,
      personalPhone,
      title,
      personalId,
      personalAddress,
      personalProvince,
      personalDistrict,
      personalSubdistrict,
      personalPostalCode,
      profile_img,
      isActive,
    } = req.body;

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        fullName,
        personalEmail,
        personalPhone,
        title,
        personalId,
        personalAddress,
        personalProvince,
        personalDistrict,
        personalSubdistrict,
        personalPostalCode,
        profile_img,
        isActive,
        updatedAt: Date.now(),
      },
      { new: true } // return updated document
    ).select("-password -token");

    if (!updatedMember) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};


// อัพเดตที่อยู่ (ไม่ใช้ req.user)
exports.updateAddress = async (req, res) => {
  try {
    const {
      memberId,
      personalAddress,
      personalSubdistrict,
      personalDistrict,
      personalProvince,
      personalPostalCode,
    } = req.body;

    if (!memberId) {
      return res.status(400).json({ error: "Member ID is required" });
    }

    const updatedMember = await Member.findOneAndUpdate(
      { memberId },
      {
        personalAddress,
        personalSubdistrict,
        personalDistrict,
        personalProvince,
        personalPostalCode,
        updatedAt: Date.now(),
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Address updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Failed to update address" });
  }
};

// อัพโหลดรูปโปรไฟล์ (ไม่ใช้ req.user)
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({ error: "Member ID is required" });
    }

    // 🔍 Find member
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // 🗑️ Delete old image if exists
    if (member.profile_img) {
      try {
        const oldImageUrl = member.profile_img;
        const oldImageKey = oldImageUrl.split(
          `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
        )[1];

        if (oldImageKey) {
          const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: oldImageKey,
          };
          await s3Client.send(new DeleteObjectCommand(deleteParams));
        }
      } catch (deleteError) {
        console.error("Error deleting old profile image:", deleteError);
      }
    }

    // 📤 Upload new image to S3
    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `profile-images/${memberId}-${Date.now()}.${fileExt}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // 💾 Update DB
    await Member.findByIdAndUpdate(memberId, {
      profile_img: imageUrl,
      updatedAt: Date.now(),
    });

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ error: "Failed to upload profile image" });
  }
};



exports.getall = async (req , res) => {
  try {
    const users = await Member.find();
    res.status(200).json(users)
  } catch (error) {
      console.error("Error fetching :", error);
      res.status(500).json({ error: "Failed to get all members" });
  }
}


exports.getCourses = async (req , res) => {
 try {
    // 1. Retrieve all courses from the database
    const courses = await Course.find({}); // The empty object {} means "find all"
    // 2. Respond with the list of courses
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully!',
      courses: courses // Send back the array of course documents
    });
  } catch (err) {
    console.error('❌ Error retrieving courses:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
      error: err.message // It's a good practice to send the error message back to the client
    });
  }

}

exports.getCourseByID = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format',
      });
    }

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully!',
      course: course,
    });
  } catch (err) {
    console.error('❌ Error retrieving course:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve course',
      error: err.message,
    });
  }
};

exports.getRoundByID = async (req, res) => {
  const roundId = req.params.id;

  try {
    const round = await Round.findById(roundId)

    if (!round) {
      return res.status(404).json({
        success: false,
        message: 'Round not found'
      });
    }

    res.status(200).json({
      success: true,
      round
    });
  } catch (err) {
    console.error('❌ Error fetching round:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};