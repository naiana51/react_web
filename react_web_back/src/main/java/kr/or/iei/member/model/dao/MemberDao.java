package kr.or.iei.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.PageInfo;
import kr.or.iei.member.model.vo.Member;

@Mapper
public interface MemberDao {

	Member selectOneMember(String memberId);

	int insertMember(Member member);

	int changePhone(Member member);

	int deleteMember(String memberId);

//	int pwUpdateMember(Member member);

	int changePw(Member member);

	int totalCount();

	List memberList(PageInfo pi);

	int changeType(Member member);


}
