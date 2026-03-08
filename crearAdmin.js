import bcrypt from "bcryptjs";
import { supabase } from "./src/config/supabase.js";

const password = "1234";
const encriptado = await bcrypt.hash(password, 10);
console.log("Hash generado:", encriptado);

const { data, error } = await supabase
  .from("usuarios")
  .update({ password: encriptado })
  .eq("username", "admin")
  .select();

console.log("data:", data);
console.log("error:", error);
