import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import { useRef } from "react";
import { prefixUserURL } from "../user";

function SignUp(): JSX.Element{
  const navigator: NavigateFunction = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confPasswordRef = useRef<HTMLInputElement>(null);

  async function signUp(): Promise<void>{
    if(emailRef.current && passwordRef.current && confPasswordRef.current){
      try{
        const response: Response = await fetch(`${prefixUserURL}/signup`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirmation: confPasswordRef.current.value
          })
        });
        console.log(response.status);
        if(response.redirected && response.status == 200){
          navigator("/signin");
        }
      }
      catch(err){
        console.log("Sign in failed.", err);
      }
    }
  }

  return(
    <main>
      <form>
        <h1>Sign Up</h1>
        <div>  
          <input placeholder="Email" ref={emailRef}/>
          <input placeholder="Password" ref={passwordRef}/>
          <input placeholder="Confirm Password" ref={confPasswordRef} />
          <button onClick={signUp}>Sign In</button>
        </div>
        <div>
          <p>Already have an account?</p>
          <Link to="/signin">Sign Up</Link>
        </div> 
      </form>
    </main>
  )
}

export default SignUp;