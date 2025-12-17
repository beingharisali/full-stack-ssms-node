class ValidationService {
	validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	validatePassword(password) {
		return password && password.length >= 8;
	}

	validateRole(role) {
		const validRoles = ["admin", "agent", "client"];
		return validRoles.includes(role);
	}

	validateTicketPriority(priority) {
		const validPriorities = ["low", "medium", "high"];
		return validPriorities.includes(priority);
	}

	validateTicketStatus(status) {
		const validStatuses = ["open", "in-progress", "resolved"];
		return validStatuses.includes(status);
	}

	validateRequiredFields(data, requiredFields) {
		const missing = [];
		for (const field of requiredFields) {
			if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
				missing.push(field);
			}
		}
		return missing;
	}

	sanitizeString(str) {
		return str ? str.trim() : '';
	}
}

module.exports = new ValidationService();