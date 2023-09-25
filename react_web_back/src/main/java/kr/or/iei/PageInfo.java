package kr.or.iei;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
// @Alias -> mybatis 사용하려고 만드는 어노케이션
public class PageInfo {

	private int start;
	private int end;
	private int pageNo;
	private int pageNaviSize;
	private int totalPage;
	
}
