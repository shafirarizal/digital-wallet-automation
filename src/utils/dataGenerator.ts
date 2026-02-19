export function generateRandomUser() {
  const timestamp = new Date().getTime();
  return {
    username: `testuser_${timestamp}`,
    password: `Pass_${timestamp}!`
  };
}