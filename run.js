const imgService = require('./imgService');

function main() {
  const opts = {
    path: 'pages/tabbar/index',
    queryKey: 'channel',
    queryParams: 'mjxy_xcx',
    inputToken: '24_LQRp1zTInNcdHMC73I8wY91qk4VPQ6tIF-BRCzfAXI4Vjp-vcHaV8cXXam7kF0S2QMmhdFPx7E7TcZ1OT8pGv0MsAiI7ctV5CEoOutxQII9okEy1buEal-OateQSTZiAHAZAG'
  };
  imgService(opts);
  return ;
}

main();