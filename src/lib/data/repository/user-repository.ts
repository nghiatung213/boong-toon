/** JSON-file user store (legacy). Supabase mode uses auth-service + profiles table. */
export {
  findUserById,
  findUserByEmail,
  findUserByUsername,
  createUser,
  verifyUserLogin,
} from "@/lib/data/repository/json/user-repository";
