package kr.or.iei.board.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.PageInfo;
import kr.or.iei.Pagination;
import kr.or.iei.board.model.dao.BoardDao;
import kr.or.iei.board.model.vo.Board;
import kr.or.iei.board.model.vo.BoardFile;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.vo.Member;

@Service
public class BoardService {

	@Autowired
	private BoardDao boardDao;
	
	@Autowired
	private Pagination pagination;
	
	@Autowired
	private MemberDao memberDao;

	public Map boardList(int reqPage) {
		
		// 게시물조회, 페이징에 필요한 데이터를 취합
		// -> DB에서 필요한 정보들 쿼리 작업해놓기
		
		// 한 페이지당 게시물 수
		int numPerPage = 12;
		
		// 페이지 네비게이션 길이
		int pageNaviSize = 5;
		
		// 총 게시물 수
		int totalCount = boardDao.totalCount();
		
		// 페이징조회 및 페이지네비 제작에 필요한 데이터를 객체로 받아옴
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		
		List boardList = boardDao.selectBoardList(pi);
		
		// 되돌려줘야할 게 2개(pi, boardList). 그래서 map으로 묶어서 리턴해줌
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("boardList", boardList);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int insertBoard(Board b, ArrayList<BoardFile> fileList) {
		System.out.println(b);
		System.out.println(fileList);
		
		// 작성자 정보를 현재 아이디만 알고있음 -> Board테이블에는 회원번호가 외래키로 설정되어 있음
		// 아이디를 이용해서 번호를 구해옴(회원정보를 조회해서 회원정보 중 번호를 사용)
		Member member = memberDao.selectOneMember(b.getMemberId());
		b.setBoardWriter(member.getMemberNo());
		int result = boardDao.insertBoard(b);
		for(BoardFile boardFile : fileList) {
			boardFile.setBoardNo(b.getBoardNo());
			result += boardDao.insertBoardFile(boardFile);
		}
		if(result == 1+fileList.size()) {
			return result;
		}else {
			return 0;
		}
	}

	public Board selectOneBoard(int boardNo) {
		Board b = boardDao.selectOneBoard(boardNo);
//		List fileList = boardDao.selectOneBoardFile(boardNo);
//		b.setFileList(fileList);
		return b;
	}

	public BoardFile getBoardFile(int boardFileNo) {
		return boardDao.getBoardFile(boardFileNo);
	}

	@Transactional
	public List<BoardFile> delete(int boardNo) {
		List<BoardFile> list = boardDao.selectBoardFileList(boardNo);
		int result = boardDao.deleteBoard(boardNo);
		if(result > 0) {
			return list;
		}
		return null;
	}

	@Transactional
	public List<BoardFile> modify(Board b, ArrayList<BoardFile> fileList) {
		List<BoardFile> delFileList = new ArrayList<BoardFile>();
		String [] delFileNo = {};
		int result = 0;
		if(!b.getDelFileNo().equals("")) {
			delFileNo = b.getDelFileNo().split("/");
			// 1. 삭제한 파일이있으면 조회
			delFileList = boardDao.selectBoardFile(delFileNo);
			// 2. 삭제할 파일 삭제
			result += boardDao.deleteBoardFile(delFileNo);
		}
		// 3. 추가할 파일있으면 추가
		for(BoardFile bf : fileList) {
			result += boardDao.insertBoardFile(bf);
		}
		
		// 4. board테이블 변경(무조건 동작
		result += boardDao.updateBoard(b);
		if(result == 1+fileList.size()+delFileNo.length) {
			return delFileList;
		}else {
			return null;
		}
	}

	public Map adminList(int reqPage) {
		int totalCount = boardDao.adminTotalCount();
		int numPerPage = 10;
		int pageNaviSize = 5;
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List boardList = boardDao.adminBoardList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("list", boardList);
		map.put("pi", pi);
		return map;
	}

	public int changeStatus(Board b) {
		return boardDao.changeStatus(b);
	}

	
}
