import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button2, Button3 } from "../../util/Buttons";
import Swal from "sweetalert2";

const BoardView = (props) => {
  const isLogin = props.isLogin;
  const location = useLocation();
  const boardNo = location.state.boardNo;
  const [board, setBoard] = useState({});
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/board/view/" + boardNo)
      .then((res) => {
        console.log(res.data);
        setBoard(res.data);
      })
      .catch((res) => {
        console.log(res.response.status);
      });
    if (isLogin) {
      const token = window.localStorage.getItem("token");
      axios
        .post("/member/getMember", null, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          console.log(res.data);
          setMember(res.data);
        })
        .catch((res) => {
          console.log(res.response.status);
        });
    }
  }, []);

  const modify = () => {
    navigate("/board/modify", { state: { board: board } });
  };

  const deleteBoard = () => {
    Swal.fire({
      icon: "warning",
      text: "게시글을 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => {
      // 삭제버튼을 취소버튼을 누르건 then은 무조건 동작
      if (res.isConfirmed) {
        axios
          .get("/board/delete/" + board.boardNo)
          .then((res) => {
            console.log(res.data);
            if (res.data === 1) {
              navigate("/board");
            }
          })
          .catch((res) => {
            console.log(res.response.status);
          });
      }
    });
  };

  const changeStatus = () => {
    const obj = { boardNo: board.boardNo, boardStatus: 2 };
    const token = window.localStorage.getItem("token");
    axios
      .post("/board/changeStatus", obj, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data === 1) {
          Swal.fire("게시물이 차단되었습니다.");
        } else {
          Swal.fire("변경 중 문제가 발생했습니다.");
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <div className="board-view-wrap">
      <div className="board-view-title">{board.boardTitle}</div>
      <div className="board-view-info">
        <div>{board.memberId}</div>
        <div>{board.boardDate}</div>
      </div>
      <div className="board-view-file">
        {board.fileList
          ? board.fileList.map((file, index) => {
              return <FileItem key={"file" + index} file={file} />;
            })
          : ""}
      </div>
      <div className="board-view-thumbnail">
        {board.boardImg ? (
          <img src={"/board/" + board.boardImg} />
        ) : (
          <img src="/img/default.png" />
        )}
      </div>
      <div
        className="board-view-detail"
        dangerouslySetInnerHTML={{ __html: board.boardDetail }}
      ></div>
      <div className="board-view-btn-zone">
        {isLogin ? (
          member && member.memberNo === board.boardWriter ? (
            <>
              <Button2 text="수정" clickEvent={modify} />
              <Button2 text="삭제" clickEvent={deleteBoard} />
            </>
          ) : (
            ""
          )
        ) : (
          ""
        )}

        {member && member.memberType === 1 ? (
          <Button3 text="차단" clickEvent={changeStatus} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const file = props.file;

  const fileDown = () => {
    axios
      .get("/board/filedown/" + file.boardFileNo, {
        // axios는 기본적으로 응답을 json으로 받음
        // But, 이번 요청은 파일데이터를 받아야함
        // So, 일반적인 json으로 처리 불가능
        // So, 파일로 받겠다는 설정하기
        responseType: "blob",
      })
      .then((res) => {
        // 서버에서 받은 데이터는 바이너리데이터(0과 1로 구성된 데이터)
        // 위 데이터를 blob형식으로 변환
        const blob = new Blob([res.data]);

        // blob데이터를 이용해서 데이터객체 URL 생성
        const fileObjectUrl = window.URL.createObjectURL(blob);

        // blob데이터 url을 다운로드할 링크 생성
        const link = document.createElement("a");
        link.href = fileObjectUrl;
        link.style.display = "none"; // 화면에 a태그 안보이게

        // 파일명 디코딩하는 함수
        const downloadFilename = (data) => {
          const disposition = data.headers["content-disposition"];
          const filename = decodeURI(
            disposition
              .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
              .replace(/['"]/g, "")
          );
          return filename;
        };
        // 다운로드할 파일 이름 지정
        link.download = downloadFilename(res);

        document.body.appendChild(link); // 파일과 연결된 a태그를 문서에 추가
        link.click(); // a태그를 클릭해서 다운로드
        link.remove(); // 다운로드 후 삭제
        window.URL.revokeObjectURL(fileObjectUrl); // 파일링크 삭제
      })
      .catch((res) => {
        console.log(res.response.status);
      });
  };

  return (
    <div className="board-file">
      <span onClick={fileDown} className="material-icons file-icon">
        file_download
      </span>
      <span className="file-name">{file.filename}</span>
    </div>
  );
};

export default BoardView;
