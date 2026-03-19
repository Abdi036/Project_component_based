import User from '../models/userModel.js';

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const findUserById = async (id) => {
    return await User.findById(id).select('-password');
};

export const createUser = async (userData) => {
    const user = await User.create(userData);
    return user;
};

export const updateUserProfile = async (id, data) => {
    const user = await User.findById(id);
    if (!user) return null;
    
    if (data.name) user.name = data.name;
    if (data.profileData) {
        user.profileData = { ...user.profileData, ...data.profileData };
    }
    
    await user.save();
    return user;
};
