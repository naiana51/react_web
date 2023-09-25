package kr.or.iei.member.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.member.model.service.MemberService;
import kr.or.iei.member.model.vo.Member;

@RestController
@RequestMapping(value="/member")
public class MemberController {
	
	@Autowired
	private MemberService memberService;
	
	/*
	@GetMapping(value="/checkId")
	public int checkId(String memberId) {
		System.out.println("중복체크 할 아이디 : "+memberId);
		Member m = memberService.selectOneMember(memberId);
		if(m == null) {
			return 0;
		}else {
			return 1;
		}
	}
	*/
	
	@GetMapping(value="/checkId/{memberId}")
	public int checkId(@PathVariable String memberId) {
		Member m = memberService.selectOneMember(memberId);
		if(m == null) {
			return 0;
		}else {
			return 1;
		}
	}
	
	@PostMapping(value="/join")
	public int join(@RequestBody Member member) {
		// service호출시 메소드이름이 Member로 끝나면서 매개변수가 Member타입이면 비밀번호 암호화 수행
		int result = memberService.insertMember(member);
		return result;
	}
	
	@PostMapping(value="/login")
	public String login(@RequestBody Member member) {
		String result = memberService.login(member);
		return result;
	}
	
	@PostMapping(value="/getMember")
	public Member mypage(@RequestAttribute String memberId) {
		return memberService.selectOneMember(memberId);
	}
	
	@PostMapping(value="/changePhone")
	public int changePhone(@RequestBody Member member) {
		return memberService.changePhone(member);
	}
	
	@PostMapping(value="/deleteMember")
	public int deleteMember(@RequestAttribute String memberId) {
		return memberService.deleteMember(memberId);
	}
	
	@PostMapping(value="/pwCheck")
	public int pwCheck(@RequestBody Member member, @RequestAttribute String memberId) {
		member.setMemberId(memberId);
		return memberService.pwCheck(member);
	}
	
//	@PostMapping(value="/pwUpdate")
//	public int pwUpdate(@RequestBody Member member, @RequestAttribute String memberId) {
//		member.setMemberId(memberId);
//		int result = memberService.pwUpdateMember(member);
//		return result;
//	}
	
	@PostMapping(value="/changePw")
	public int changePw(@RequestBody Member member, @RequestAttribute String memberId) {
		member.setMemberId(memberId);
		return memberService.pwChangeMember(member);
	}
	
	@GetMapping(value="/list/{reqPage}")
	public Map list(@PathVariable int reqPage) {
		return memberService.memberList(reqPage);
	}
	
	@PostMapping(value="/changeType")
	public int changeType(@RequestBody Member member) {
		return memberService.changeType(member);
	}
	
}
