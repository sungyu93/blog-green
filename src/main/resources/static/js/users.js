let isUsernameSameCheck = false;

$("#btnjoin").click(() => {
	join(); // join 버튼을 누르면 함수가 실행된다.
});


// 유저네임 중복 체크
$("#btnUsernameSameCheck").click(() => {
	checkUsername(); // 메서드는 언제나 동사가 앞에 오는 게 좋다.
});

$("#btnLogin").click(() => {
	login();
});

$("#btnDelete").click(() => {
	resign();
});


$("#btnUpdate").click(() => {
	update();
});

function join() {
	if (isUsernameSameCheck == false) {
		alert("유저네임 중복체크를 진행해주세요");
		return;
	}

	// 0. 통신 오브젝트 생성 (이건 자바스크립트 오브젝트다)
	let data = {
		username: $("#username").val(),
		password: $("#password").val(),
		email: $("#email").val()
	};

	$.ajax("/join", {
		type: "POST",
		dataType: "json",
		data: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json"
		} // 나 지금 너한테 json 데이터 날릴 거야
	}).done((res) => {
		if (res.code == 1) {
			// console.log(res);
			location.href = "/loginForm";
		}

	});
}

function checkUsername() {
	// 0. 통신 오브젝트 생성 (Get 요청은 body가 없다.)

	// 1. 사용자가 적은 username 값을 가져오기
	let username = $("#username").val();

	// 2. Ajax 통신
	$.ajax(`/users/usernameSameCheck?username=${username}`, {
		type: "GET",
		dataType: "json",
		async: true
	}).done((res) => {
		if (res.code == 1) { // 통신 성공
			if (res.data == false) {
				alert("아이디가 중복되지 않았습니다.")
				isUsernameSameCheck = true;
			} else {
				alert("아이디가 중복되었어요. 다른 아이디를 사용해주세요.");
				isUsernameSam = true;
				$("#inputUsername").val("");
				isUsernameSameCheck = false;
			}
		}
	});
}

function login() {
	let data = {
		username: $("#username").val(),
		password: $("#password").val(),
		remember: $("#remember").prop("checked")
	};
	$.ajax("/login", {
		type: "POST",
		dataType: "json",   // 응답 데이터
		data: JSON.stringify(data),   // http body에 들고갈 요청 데이터
		headers: {   // http header에 들고갈 요청 데이터
			"Content-Type": "application/json; charset=utf-8"
		}
	}).done((res) => {
		if (res.code == 1) {
			location.href = "/";
		} else {
			alert("로그인 실패, 아이디 패스워드를 확인해 주세요");
			//            history.back();
		}
	});
}

function resign() {
	let id = $("#id").val();
	$.ajax("/users/" + id, {
		type: "DELETE",
		dataType: "json",
	}).done((res) => {
		if (res.code == 1) {
			alert("회원 탈퇴 완료");
			location.href = "/";
		} else {
			alert("회원 탈퇴 실패");
		}
	});
}

function update() {
	let data = {
		password: $("#password").val(),
		email: $("#email").val()
	};

	let id = $("#id").val();

	$.ajax("/users/" + id, {
		// ${users.id}이렇게 적으면 안 되는 이유는 따로 파일을 빼서 연결시키려고 할 때 안 먹기 때문이다.
		// jsp 일 때만 동작하고 js로 분리 시키면 동작을 안 한다.
		// 규칙: el표기방법을 script 안에 넣지 말기~!
		type: "PUT",
		dataType: "json",
		data: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json"
		} // 나 지금 너한테 json 데이터 날릴 거야
	}).done((res) => {
		if (res.code == 1) {
			alert("회원 수정 완료");
			location.reload(); // F5 
		} else {
			alert("업데이트에 실패하였습니다.");
		}

	});
}