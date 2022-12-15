import React, { useState } from 'react';
import TeamAPI from '../0. API/TeamAPI';
import '../2. Login/Login.css';
import '../font/Jalnan.ttf';
import "../images/아이셔용.png"
import { motion } from "framer-motion";
import { GoogleButton } from 'react-google-button';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import Cookies from 'universal-cookie';
import kakao from '../images/kakao2.png';
import { REST_API_KEY, REDIRECT_URI } from '../0. API/kakaoAPI';
import { useNavigate } from "react-router-dom";
import lock from "../images/lock.png";
import person from "../images/person.png";
import google from "../images/google_logo_icon.png";
import CustomModal from '../99. Modal/CustomModal'
import logo from '../images/logo.png';



function Login() {
  // // ▼ 로그인되어 있으면 바로 HOME 으로 이동 
  // const isLogin = window.sessionStorage.getItem("isLogin");
  // if (isLogin === "TRUE") window.location.replace("/home");
  // // ▲ 로그인되어 있으면 바로 HOME 으로 이동

  const cookies = new Cookies();
  const localId = cookies.get('rememberId');

  const navigate = useNavigate();

  if (localId !== undefined) navigate("/home");

  /* ===== CustomModal 에 필요 ===== */
  const [state, setState] = useState({
    open: false, success: false, error: false,
    successMsg: "회원가입 성공", errorMsg: "아이디 또는 비밀번호를 확인하세요!"
  });

  const onChangeState = () => {
    setState({...state, open: false, success: false, error: false});
  }
  /* ============================== */

  const EnterPress = (e) => {
    if (e.key === 'Enter') {
      onClickLogin();
    }
  }

  const signInWithGoogle = () => {

    // e.preventDefault();
    signInWithPopup(auth, provider).then((result) => {
      console.log(result);

      const email = result.user.email;


      // setCookie('rememberEmail', email);
      cookies.set('rememberEmail', email, {
        path: '/',
        expires: 0
      }
      );


      console.log("얻어온 구글 이메일(serCookies) " + cookies.get('rememberEmail'));
      googleInfo();
    }).catch((error) => {
      console.log(error);
    })
  };

  const googleInfo = async (e) => {
    try {
      // console.log("try 넘어서 loaclStorage온 구글 아이디 : " + localStorage.getItem("email"));
      console.log("try 넘어서 cookie로 얻어온 구글 아이디 : " + cookies.get('rememberEmail'));
      // const res = await TeamAPI.googleInfo(localStorage.getItem("email"));
      const res = await TeamAPI.googleInfo(cookies.get('rememberEmail'));

      console.log('날아온데이터 : ' + res.data);
      if (res.data.id != null) {
        alert('일치하는 이메일이 있습니다. 해당 아이디로 로그인 합니다.')

        cookies.set('rememberId', res.data.id, {
          path: '/',
          expires: 0
        }
        );
        console.log(cookies.rememberId);
        navigate("/home");

      } else {
        alert('일치하는 이메일이 없습니다. 회원가입 페이지로 이동합니다.')
        navigate("/signup");
      }
    } catch {
      console.log(e)
    }
  };

  // 카카오톡 로그인
  const kakao_Auth_Url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  // const handlerLogin = () => {
  // //   window.location.href = kakao_Auth_Url;
  //   navigate(kakao_Auth_Url);

  // }

  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [checkedItems, setCheckedItems] = useState(false);


  const onClickAutologin = () => {
    if (checkedItems === false) {
      setCheckedItems(true);
    } else {
      setCheckedItems(false);
    }
  }

  /*
  아이디 변경 */
  const onChangeId = (e) => {
    let temp_id = e.target.value;
    setId(temp_id);
  }

  /*
  비밀번호 변경 */
  const onChangePwd = (e) => {
    let temp_pwd = e.target.value;
    setPwd(temp_pwd);
  }


  /*
  Login 버튼 클릭 */
  const onClickLogin = async (e) => {
    // e.preventDefault();

    console.log(checkedItems);
    console.log("입력한 ID : " + id);
    console.log("입력한 Password : " + pwd);
    console.log("LOGIN 버튼 눌렀어요.");
    // window.sessionStorage.setItem("id", id);
    // window.sessionStorage.setItem("pwd", pwd);

    try {
      const res = await TeamAPI.userLogin(id, pwd);
      // 로그인을 위한 axios 호출
      // console.log("호출 TRY : " + res.data.result);

      window.sessionStorage.setItem("isLogin", "TRUE");
      console.log("res.data : " + res.data);
      console.log("checkedItems : " + checkedItems);
      // if(res.data.result === "OK") {
      if (res.data === true) {
        if (checkedItems === true) {
          const Autologin = new Date();
          Autologin.setDate(Autologin.getDate() + 10);
          console.log('자동로그인 여기 찍힘? : ' + Autologin);
          cookies.set('rememberId', id, {
            path: '/',
            expires: Autologin
          }
          );

        } else {
          console.log('그냥로그인  여기 찍힘? : ');
          cookies.set('rememberId', id, {
            path: '/',
            expires: 0
          },
          );

        }
        navigate("/home");
      } else {
        // alert("아이디 또는 비밀번호를 확인하세요!");
        setState({...state, open: true, error: true, errorMsg: "아이디 또는 비밀번호를 확인하세요!"});
      }
    } catch (e) {
      console.log(e);
    }
  }



  return (
    <div className='No-Nav-Container'>
      <CustomModal state={state} changeState={onChangeState}/>
    <div className="Login-Container">

        <div className="Login-Main-Header">
            <img src={logo} alt="logo" />
            <h1>MBTISOUR</h1>
        </div>

        {/* <form action="" className="Login-card-form"> */}
       
        {/* 아이디 */}
        <div className='Login-Body'>
        {/* <div className='Auto-Login2'>
        <label>
              <input className='Auto-Login-input' type="checkbox" id='checkbox' onClick={onClickAutologin} />
              <span className='Auto-Login-text'>자동로그인</span>
        </label>
        </div> */}
          <div className="Login-Id">
            <img src={person} />
            <input className="Login-input" type="text" placeholder="Enter ID" value={id} onKeyDown={EnterPress} onChange={onChangeId} required />
          </div>

          {/* 비밀번호 */}
          
          <div className="Login-PW">
            <img className="Login-input-img" src={lock} />
            <input className="Login-input" type="password" placeholder="Enter Password" onKeyDown={EnterPress} value={pwd} onChange={onChangePwd} />
          </div>

        {/* <form className='Auto-Login'> */}
        <div className='Auto-Login' >
          {/* <div className='Auto-Login2'> */}
          <label>
            <input className='Auto-Login-input' type="checkbox" id='checkbox' onClick={onClickAutologin} />
            <span className='Auto-Login-text'>자동로그인</span>
          </label>
          <span>|</span>
          <a href="/FindInfo">아이디/비밀번호 찾기</a>
        </div>
            
            {/* <span>|</span> */}
            {/* <span><a href="/signup">  회원가입</a> </span>   */}
          {/* </div> */}
          
          
        </div>
        {/* </form> */}
        
        <motion.button className="Login-botton" type="submit" onClick={onClickLogin}>로그인
        
        </motion.button>

                {/* 소셜로그인 */}
          
        <div className='Login-kakao'>
          <a  className='login-logo'>
            <a href={kakao_Auth_Url}>
              <div className='img-circle'>
              <img className='kakao-img'style={{width:"4rem",height:"4rem",objectFit:"cover"}} src={kakao} />
              </div>
            </a>
          카카오 로그인
            </a>
            <a  className='login-logo'>
          <div className='img-circle'>
          <img className='google-img' src={google} onClick={signInWithGoogle} style={{width:"2rem",height:"2rem",objectFit:"cover"}} >
            </img>
          </div>
          구글 로그인
            </a>
         </div>
         
       
        
        <div className="Login-footer">
          가입하고 친구를 만들어봐요! <a href="/signup">  회원가입</a>
        </div>


      </div>
    </div>
  );
}

export default Login;