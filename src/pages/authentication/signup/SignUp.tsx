import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import { useRef, MouseEvent } from "react";
import { prefixUserURL } from "../user";

function SignUp(): JSX.Element{
  const navigator: NavigateFunction = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confPasswordRef = useRef<HTMLInputElement>(null);

  async function signUp(e: MouseEvent<HTMLButtonElement>): Promise<void>{
    e.preventDefault();
    if(emailRef.current && passwordRef.current && confPasswordRef.current){
      console.log([emailRef.current.value, passwordRef.current.value, confPasswordRef.current.value]);
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
          <input placeholder="Email" type="text" ref={emailRef}/>
          <input placeholder="Password" type="password" ref={passwordRef}/>
          <input placeholder="Confirm Password" type="password" ref={confPasswordRef} />
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