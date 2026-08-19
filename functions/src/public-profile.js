const publicProfileFields = ["nome", "foto", "cidade", "estado", "verificationStatus"];

function createPublicProfile(userId, user) {
  const publicProfile = { id: userId };

  publicProfileFields.forEach(fieldName => {
    if (user[fieldName] !== undefined && user[fieldName] !== null && user[fieldName] !== "") {
      publicProfile[fieldName] = user[fieldName];
    }
  });

  return publicProfile;
}

module.exports = { createPublicProfile };
