import request from "@/request";
// import { getAccessToken } from '@/utils/auth'

import type {
  nerRequestParam,
  NerResponseResult,
  llmRequestParam,
  llsResponseResult,
} from "@/apis/cyfj/type";




export function getToken() {
  // getToken url：https://10.0.3.73:22891/v10/auth/get-access-token?appkey=aicp_app

  const result = request({
    url: "/v10/auth/get-access-token?appkey=aicp_app",

    method: "get",

    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    baseURL: "/apiToken",

    // `headers` 是即将被发送的自定义请求头
    headers: { 
      "Content-Type": "application/json",
      "User-Agent": 'Apifox/1.0.0 (https://apifox.com)'
    },

    // `params` 是即将与请求一起发送的 URL 参数
    params: {   //todo 需要修改？还是隐藏？
      ID: 12345,
    },

    // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
    // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
    auth: {   //todo 需要修改
      username: "janedoe",
      password: "s00pers3cret",
    },
  });

  console.log(result);
  return result;
}




export function getCaseInfoResult(param: nerRequestParam) {
  // 命名实体识别url：http://10.0.3.73:22890/v10/nlp/recog/cn_yesorno_fz/ner?appkey=aicp_app

  const raw = JSON.stringify({
    text: "问：地点？\t答：北京市朝阳区工体北路11号楼1层三里屯超市。",
  });
  const result = request<NerResponseResult>({
    url: "/v10/nlp/recog/cn_yesorno_fz/ner?appkey=aicp_app",
    method: 'post',
    data: raw,  // `data` 是作为请求主体被发送的数据。只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'。类型可为对象或字符串。
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    baseURL: "/apiNER",
    // `headers` 是即将被发送的自定义请求头
    headers: { 
      "Content-Type": "application/json",
      "User-Agent": 'Apifox/1.0.0 (https://apifox.com)',
      'X-Hci-Access-Token': 'xxxxx'    //todo 需要修改
    },
  });

  console.log(result);
  return result;
}




export function getLLMResult(param: llmRequestParam) {
  debugger;
  const data = {
    config: {
      streamOutput: true,
    },
    text: "假设你是一名公安警察，根据笔录和中华人民共和国法律，说明犯罪嫌疑人涉嫌哪些犯罪。以根据笔录开头。以根据《中华人民共和国刑事诉讼法》第xx条之规定，拟提请对犯罪嫌疑人XX（刑事拘留、取保候审、延长拘留期限至、提请逮捕等等）结尾。笔录如下：```问：现在依法对你进行传讯，你要如实回答，听明白了吗？答：听明白了。问：说一下你的个人信息？答：张奎，24岁，大四学生，手机号：15000000000，身份证：0000000000000000000，汉族，户籍地：北京朝阳；现住址：北京市朝阳区；犯罪记录：无；是否人大代表：不是。问：知道因为什么传唤你吗？答：知道，因为我偷了东西。问：时间？答：2022年6月9日14时许。问：地点？答：北京市朝阳区工体北路11号楼1层三里屯超市。问：说一下具体情况？答：2022年6月9日14时许，因为疫情严重，我想着出去买点吃的并囤点粮食，所以去了北京市朝阳区工体北路11号楼1层三里屯超市。我两点半到达超市，乘坐地铁前往。进入超市时，我正常扫码。我选购了一包方便面、六包牛奶、一串葡萄、一袋大米、一桶油和两包辣条。走到门口的时候，我发现是自主扫码结账，我就想试试是不是有的东西不扫码也可以带走，于是我故意把辣条和葡萄藏起来，没有扫码。结果出门的时候警报器响了，工作人员过来问我有没有东西没扫码，我承认了自己偷拿了辣条和葡萄，然后警察就来了。问：你偷了什么东西？答：两包辣条和一串葡萄，总价值35元人民币。问：偷的东西现在在哪里？答：我已经付款了，现在在保安室存放。问：为什么要偷东西？答：我想试试不扫码行不行，要是行的话就想以后也这么干。问：你知道你这属于什么行为吗？答：我知道，属于盗窃行为，违法。问：你认罪认罚吗？答：我认罪认罚。问：民警在讯问过程中有违法行为吗？答：没有。问：看下笔录，确认无误后签字按手印。答：好的。```",
  };

  // 大数据url：http://10.0.1.168:35751/v10/llm/chat/common/completion

  const result = request<llsResponseResult>({
    url: "/v10/llm/chat/common/completion",
    method: 'post',
    data: data,  // `data` 是作为请求主体被发送的数据。只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'。类型可为对象或字符串。
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    baseURL: "/apiLLM",
    // `headers` 是即将被发送的自定义请求头
    headers: { 
      "Content-Type": "application/json",
      "User-Agent": 'Apifox/1.0.0 (https://apifox.com)'
    },
  });

  console.log(result);
  return result;
}






// 大模型：
// http://10.0.1.168:25659/v10/llm/chat/common/completion  // 群里
// http://10.0.1.168:35751/v10/llm/chat/common/completion  // 威哥
// http://10.0.1.111:25600/v10/llm/chat/common/completion   //研哥

// 右下角接口：
// var myHeaders = new Headers();
// myHeaders.append("X-Hci-Access-Token", "MM1VMBc7eYUlQpeO44075c0e64ae3a96");
// myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
// myHeaders.append("Content-Type", "application/json");
// var raw = JSON.stringify({ "text": "问：地点？\t答：北京市朝阳区工体北路11号楼1层三里屯超市。" });
// var requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
// fetch("https://10.0.1.119:22801/v10/nlp/recog/cn_yesorno_fz/ner?appkey=aicp_app", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
