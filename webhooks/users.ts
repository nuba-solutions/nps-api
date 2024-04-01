const usersTable: { [index: string]: { webhook: string; email: string } } = {
  "1": { webhook: "http://localhost:3000/api/users/1", email: "karen@example.com" },
  "2": {
    webhook: "http://localhost:3000/api/users/1",
    email: "thomas@example.com",
  },
  "3": { webhook: "http://localhost:3000/api/users/1", email: "sofia@example.com" },
  "4": { webhook: "http://localhost:3000/api/users/1", email: "peter@example.com" },
  "5": { webhook: "http://localhost:3000/api/users/1", email: "clara@example.com" },
  "6": { webhook: "http://localhost:3000/api/users/1", email: "john@example.com" },
};

export const getUserById = async (userId: string) => usersTable[userId];
