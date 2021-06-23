'use strict';

const firebase = require('../db');
const Student = require('../models/user');
const firestore = firebase.firestore();
var kakaocert = require('kakaocert');

kakaocert.config( {
    // 연동신청하여 발급받은 링크아이디, 비밀키
    LinkID :'HELLOCOCK_KC',
    SecretKey : 'xiT9O2wtV5htOHImgFIpkV/lSuIj756OYRUdRnhSOKE=',

    // 인증토큰 IP제한기능 사용여부, 권장(true)
    IPRestrictOnOff: true,

    // 인증토큰정보 로컬서버 시간 사용여부
    UseLocalTimeYN: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

// kakaoCert 서비스 클래스 생성
var kakaocertService = kakaocert.KakaocertService();


const getkakaocert = async (req, res, next) => {
    try {
   
        const id = req.params.id;
        const user = await firestore.collection('user').doc(id);
        const data = await user.get();
        if(!data.exists) {
            res.status(404).send('Student with the given ID not found');
        }else {
            // kakaoCert 이용기관코드, kakaoCert 파트너 사이트에서 확인
    var clientCode = '021040000007';
  
    // 본인인증 요청정보 객체
    var requestVerifyAuth = {
  
      // 고객센터 전화번호, 카카오톡 인증메시지 중 "고객센터" 항목에 표시
      CallCenterNum : '1600-9999',
  
      // 인증요청 만료시간(초), 최대값 : 1000  인증요청 만료시간(초) 내에 미인증시, 만료 상태로 처리됨 (권장 : 300)
      Expires_in : 300,
  
      // 수신자 생년월일, 형식 : YYYYMMDD
      ReceiverBirthDay : data.data()['birth'],
  
      // 수신자 휴대폰번호
      ReceiverHP : data.data()['phone'],
  
      // 수신자 성명
      ReceiverName : data.data()['name'],
  
      // 별칭코드, 이용기관이 생성한 별칭코드 (파트너 사이트에서 확인가능)
      SubClientID : '021050000003',
  
      // 인증요청 메시지 부가내용, 카카오톡 인증메시지 중 상단에 표시
      TMSMessage : '헬로콕 본인인증 요청',
  
      // 인증요청 메시지 제목, 카카오톡 인증메시지 중 "요청구분" 항목에 표시
      TMSTitle : '본인인증 요청',
  
      /*
      * 인증서 발급유형 선택
      * true : 휴대폰 본인인증만을 이용해 인증서 발급
      * false : 본인계좌 점유 인증을 이용해 인증서 발급
      *
      * 카카오톡 인증메시지를 수신한 사용자가 카카오인증 비회원일 경우,
      * 카카오인증 회원등록 절차를 거쳐 은행계좌 실명확인 절차를 밟은 다음 전자서명 가능
      */
      isAllowSimpleRegistYN : false,
  
      /*
      * 수신자 실명확인 여부
      * true : 카카오페이가 본인인증을 통해 확보한 사용자 실명과 ReceiverName 값을 비교
      * false : 카카오페이가 본인인증을 통해 확보한 사용자 실명과 RecevierName 값을 비교하지 않음.
      */
      isVerifyNameYN : true,
  
      // 전자서명 원문, 사용자가 전자서명할 원문, 보안을 위해 1회용으로 생성
      Token : 'Token Value',
  
      // 이용기관이 생성한 payload(메모) 값
      PayLoad : 'memo Info',
  
    };
  if(data.data()['certificated']==false){
    kakaocertService.requestVerifyAuth(clientCode, requestVerifyAuth,
      function(result){
          res.render('requestVerifyAuth', {path: req.path, receiptId: result.receiptId});
      }, function(error){
          res.render('requestVerifyAuth', {path: req.path, code: error.code, message: error.message});
      });
    
        }
        else{
            res.send('인증이 이미 완료');
    }  
   
    } 
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    getkakaocert
}