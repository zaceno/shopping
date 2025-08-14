import { createClient } from "@supabase/supabase-js"
const supabase = createClient(supabaseUrl, supabaseKey)

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "zacharias.enochsson@gmail.com",
    password: "spofd3stn!",
  })
  console.log(data, error)
}

async function main() {
  await signInWithEmail()
  const res = await supabase.from("shopping").select("*")
  console.log(res)
}

main()
