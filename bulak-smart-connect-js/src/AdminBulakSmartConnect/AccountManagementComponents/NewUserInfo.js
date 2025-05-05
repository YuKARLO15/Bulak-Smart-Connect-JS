/**
 * User management utility functions for handling user data across components
 */

// Get all users from localStorage
export const getUsers = () => {
  try {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error("Error getting users from localStorage:", error);
    return [];
  }
};

// Add a new user and store in localStorage
export const addUser = (userData) => {
  try {
    // Get existing users
    const existingUsers = getUsers();
    
    // Create new user object
    const newUser = {
      name: `${userData.firstName} ${userData.lastName}`,
      status: 'Not Logged In',
      roles: [userData.role],
      image: '',
      username: userData.username,
      email: userData.email,
      contact: `+63${userData.contact}`,
      // Store additional user details for possible future use
      password: userData.password, // Consider encrypting this in a real app
      dateAdded: new Date().toISOString()
    };
    
    // Add new user to the array
    const updatedUsers = [...existingUsers, newUser];
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    console.log('User added successfully:', newUser);
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    return false;
  }
};

// Update a user by index
export const updateUser = (index, updatedData) => {
  try {
    const users = getUsers();
    if (index >= 0 && index < users.length) {
      users[index] = { ...users[index], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

// Delete a user by index BEFOREEEEEEEEEEEEEEE
// export const deleteUser = (index) => {
//   try {
//     const users = getUsers();
//     if (index >= 0 && index < users.length) {
//       users.splice(index, 1);
//       localStorage.setItem('users', JSON.stringify(users));
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return false;
//   }
// };


// Delete a user by index NEW and Working
export const removeUser = (index) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.splice(index, 1);
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};

// Update user profile image
export const updateUserImage = (index, imageUrl) => {
  try {
    const users = getUsers();
    if (index >= 0 && index < users.length) {
      users[index].image = imageUrl;
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating user image:", error);
    return false;
  }
};

// Search users by name, username, or email
export const searchUsers = (query) => {
  if (!query) return getUsers();
  
  const users = getUsers();
  const lowerQuery = query.toLowerCase();
  
  return users.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) ||
    (user.username && user.username.toLowerCase().includes(lowerQuery)) ||
    (user.email && user.email.toLowerCase().includes(lowerQuery))
  );
};