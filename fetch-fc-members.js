// fetch-fc-members.js
import XIVAPI from '@xivapi/js';

async function fetchFCMembers() {
  // 1. インスタンス生成（APIキーなしでも動きます）
  const xiv = new XIVAPI();

  // 2. Free Company 名とサーバー名を指定して検索
  const guildName  = 'The Round Table';          // あなたのFC名
  const serverName = 'Gaia';     // サーバー名
  const searchRes  = await xiv.freecompany.search(guildName, { server: serverName });

  if (!searchRes.Results.length) {
    console.error('Free Company が見つかりませんでした');
    return;
  }

  const fcId = searchRes.Results[0].ID;
  console.log(`取得対象FCのID: ${fcId}`);

  // 3. メンバー情報付きで詳細取得
  // data: 'M' を付けると Members（メンバー一覧）が含まれます
  const fcData = await xiv.freecompany.get(fcId, { data: 'M' });

  // xivapi-js v2.x 系ではプロパティ名が FreeCompanyMembers です
  const members = fcData.FreeCompanyMembers || fcData.FreeCompany?.Members || [];

  // 4. 結果を表示
  members.forEach((m) => {
    console.log(`${m.Name}（${m.Server}）`);
  });

  return members;
}

// 実行
fetchFCMembers().catch(console.error);
