const userModel = require("../models/users");
const bcrypt = require("bcryptjs");

class UserService {
	async createUser(userData) {
		const { firstName, lastName, email, password, role = "client" } = userData;
		
		const hashedPassword = await bcrypt.hash(password, 8);
		
		return await userModel.create({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.toLowerCase(),
			password: hashedPassword,
			role,
		});
	}

	async findUserByEmail(email) {
		return await userModel.findOne({ email: email.toLowerCase() });
	}

	async findUserById(id) {
		return await userModel.findById(id).select("-password");
	}

	async getAllUsers() {
		return await userModel.find({}).select("-password");
	}

	async validatePassword(plainPassword, hashedPassword) {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}

	async updateUser(id, updateData) {
		const { password, ...otherData } = updateData;
		
		if (password) {
			otherData.password = await bcrypt.hash(password, 8);
		}
		
		return await userModel.findByIdAndUpdate(id, otherData, { new: true }).select("-password");
	}

	async deleteUser(id) {
		return await userModel.findByIdAndDelete(id);
	}
}

module.exports = new UserService();