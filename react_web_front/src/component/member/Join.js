import { useState } from "react";
import "./join.css";
import Input from "../../util/InputFrm";
import axios from "axios";
import { Button1, Button2, Button3 } from "../../util/Buttons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");

  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");

  const navigate = useNavigate();

  const idCheck = () => {
    const idReg = /^[a-zA-Z0-9]{4,8}$/;
    if (!idReg.test(memberId)) {
      // 정규표현식 만족하지 못했을 때
      setCheckIdMsg("아이디는 영어 대/소문자/숫자로 4~8글자입니다.");
    } else {
      // 정규표현식 만족했을 때 -> 통과했으니 DB에 중복체크
      axios
        // .get("/member/checkId", { params: { memberId: memberId } })
        .get("/member/checkId/" + memberId)
        .then((res) => {
          if (res.data == 0) {
            setCheckIdMsg("");
          } else {
            setCheckIdMsg("이미 사용중인 아이디입니다.");
          }
        })
        .catch((res) => {});
    }
  };

  const pwCheck = () => {
    if (memberPw !== memberPwRe) {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setCheckPwMsg("");
    }
  };

  const join = () => {
    if (checkIdMsg === "" && checkPwMsg === "") {
      /*
      const member = {
        memberId: memberId,
        memberPw: memberPw,
        memberName: memberName,
        memberPhone: memberPhone,
      };
      */
      const member = { memberId, memberPw, memberName, memberPhone };
      axios
        // .post("/member/join", null, { params: member }) // post는 3번째 매개변수가 params
        .post("/member/join", member) // String Boot에서 RequestBody로 받기
        .then((res) => {
          if (res.data === 1) {
            navigate("/login");
          } else {
            Swal.fire("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("입력값을 확인하세요.");
    }
  };

  return (
    <div className="join-wrap">
      <div className="join-title">회원가입</div>
      <JoinInputWrap
        data={memberId}
        setData={setMemberId}
        type="type"
        content="memberId"
        label="아이디"
        checkMsg={checkIdMsg}
        blurEvent={idCheck}
      />
      <JoinInputWrap
        data={memberPw}
        setData={setMemberPw}
        type="password"
        content="memberPw"
        label="비밀번호"
      />
      <JoinInputWrap
        data={memberPwRe}
        setData={setMemberPwRe}
        type="password"
        content="memberPwRe"
        label="비밀번호 확인"
        checkMsg={checkPwMsg}
        blurEvent={pwCheck}
      />
      <JoinInputWrap
        data={memberName}
        setData={setMemberName}
        type="type"
        content="memberName"
        label="이름"
      />
      <JoinInputWrap
        data={memberPhone}
        setData={setMemberPhone}
        type="type"
        content="memberPhone"
        label="전화번호"
      />
      <div className="join-btn-box">
        <Button2 text="회원가입" clickEvent={join} />
      </div>
      {/* <Input data={memberId} setData={setMemberId} type="text" /> */}
      {/* <Input data={memberPw} setData={setMemberPw} type="password" />
      <Input data={memberPwRe} setData={setMemberPwRe} type="password" />
      <Input data={memberName} setData={setMemberName} type="text" />
      <Input data={memberPhone} setData={setMemberPhone} type="text" /> */}
    </div>
  );
};

const JoinInputWrap = (props) => {
  const data = props.data;
  const setData = props.setData;
  const type = props.type;
  const content = props.content;
  const label = props.label;
  const blurEvent = props.blurEvent;
  const checkMsg = props.checkMsg;
  return (
    <div className="join-input-wrap">
      <div>
        <div className="label">
          <label htmlFor={content}> {label}</label>
        </div>
        <div className="input">
          <Input
            type={type}
            data={data}
            setData={setData}
            content={content}
            blurEvent={blurEvent}
          />
        </div>
      </div>
      <div className="check-msg">{checkMsg}</div>
    </div>
  );
};

export default Join;
