package com.ISOUR.FINAL.Service;


import com.ISOUR.FINAL.entity.KakaoLogin;
import com.ISOUR.FINAL.repository.KakaoRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class KakaoLoginService {

    private final KakaoRepository kakaoRepository;

    public KakaoLoginService(KakaoRepository kakaoRepository) {
        this.kakaoRepository = kakaoRepository;
    }

    // 카카오톡 로그인
    public Map<String, String> kakaoLogin(String email) {
        log.warn("★★★★★★★★★ 카카오 가입 체크 서비스★★★★★★★★★");
        log.warn("입력한 아이디(email) : " + email);

        KakaoLogin kakaoLogin = kakaoRepository.findBykakaoEmail(email);
        Map<String, String> kakaoDTO = new HashMap<>();
        String kakaoId_num = kakaoLogin.getId_num().toString();
        String kakaoId = kakaoLogin.getKakaoId().toString();
        String kakaoEmail = kakaoLogin.getKakaoEmail();

        kakaoDTO.put("kakaoId_num", kakaoId_num);
        kakaoDTO.put("kakaoEmail", kakaoEmail);
        kakaoDTO.put("kakaoId", kakaoId);
        if(kakaoLogin != null) {
            return kakaoDTO;
        } else {
            return null;
        }
    }
    // 카카오톡 테이블 저장
    public boolean kakaoSignup(String email, Long id, Long id_num) {

        KakaoLogin kakaoLogin = new KakaoLogin();
        kakaoLogin.setId_num(id_num);
        kakaoLogin.setKakaoId(id);
        kakaoLogin.setKakaoEmail(email);
        kakaoLogin.setKakaoCreateTime(LocalDateTime.now().withNano(0));

        KakaoLogin result = kakaoRepository.save(kakaoLogin);
        log.warn(result.toString());

        return true;
    }

    // 회원 정보 가져오기
    public Map<String, String> getUserInfo (String access_Token) {
        String host = "https://kapi.kakao.com/v2/user/me";
        Map<String, String> result = new HashMap<>();
        try {
            URL url = new URL(host);

            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestProperty("Authorization", "Bearer " + access_Token);
            urlConnection.setRequestMethod("GET");

            int responseCode = urlConnection.getResponseCode();
            log.warn("카톡 회원정보 responseCode = " + responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String line = "";
            String res = "";
            while((line=br.readLine())!=null)
            {
                res+=line;
            }

            log.warn("카톡 회원정보 res = " + res);

            JSONParser parser = new JSONParser();
            JSONObject obj = (JSONObject) parser.parse(res);
            JSONObject kakao_account = (JSONObject) obj.get("kakao_account");
            JSONObject properties = (JSONObject) obj.get("properties");


            String id = obj.get("id").toString();
            String nickname = properties.get("nickname").toString();
            String email = kakao_account.get("email").toString();

            result.put("access_Token", access_Token);
            result.put("kakaoId", id);
            result.put("kakaoNickname", nickname);
            result.put("kakaoEmail", email);

            br.close();

        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }

        return result;
    }
}
