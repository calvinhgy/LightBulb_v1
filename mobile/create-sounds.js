// 创建音效文件
const fs = require('fs');
const { exec } = require('child_process');

// 使用ffmpeg生成音效
function createSwapSound() {
  const command = `ffmpeg -f lavfi -i "sine=frequency=880:duration=0.2,afade=t=out:st=0.1:d=0.1" -c:a libmp3lame -q:a 2 sounds/swap.mp3`;
  exec(command, (error) => {
    if (error) {
      console.error(`创建交换音效失败: ${error}`);
    } else {
      console.log('交换音效创建成功');
    }
  });
}

// 创建肥皂泡泡破裂音效
function createMatchSound() {
  // 使用带有高频成分的短促噪声，添加滤波器模拟肥皂泡泡破裂声
  const command = `ffmpeg -f lavfi -i "anoisesrc=a=0.05:d=0.2,highpass=f=3000,lowpass=f=8000,afade=t=in:st=0:d=0.01,afade=t=out:st=0.05:d=0.15" -c:a libmp3lame -q:a 2 sounds/match.mp3`;
  exec(command, (error) => {
    if (error) {
      console.error(`创建匹配音效失败: ${error}`);
    } else {
      console.log('匹配音效创建成功');
    }
  });
}

// 创建连续消除的音效（1-5个音阶）
function createComboSounds() {
  // 基础频率，每个音阶提高一定比例
  const baseFreq = 3000;
  
  // 创建5个不同音阶的肥皂泡泡破裂声
  for (let i = 1; i <= 5; i++) {
    const freq = baseFreq * (1 + (i - 1) * 0.15); // 每个音阶提高15%
    const command = `ffmpeg -f lavfi -i "anoisesrc=a=0.05:d=0.2,highpass=f=${freq},lowpass=f=${freq*2},afade=t=in:st=0:d=0.01,afade=t=out:st=0.05:d=0.15" -c:a libmp3lame -q:a 2 sounds/match_${i}.mp3`;
    
    exec(command, (error) => {
      if (error) {
        console.error(`创建连续消除音效 ${i} 失败: ${error}`);
      } else {
        console.log(`连续消除音效 ${i} 创建成功`);
      }
    });
  }
}

function createDropSound() {
  const command = `ffmpeg -f lavfi -i "sine=frequency=440:duration=0.3,afade=t=in:st=0:d=0.05,afade=t=out:st=0.2:d=0.1" -c:a libmp3lame -q:a 2 sounds/drop.mp3`;
  exec(command, (error) => {
    if (error) {
      console.error(`创建掉落音效失败: ${error}`);
    } else {
      console.log('掉落音效创建成功');
    }
  });
}

// 创建音效目录
if (!fs.existsSync('sounds')) {
  fs.mkdirSync('sounds');
}

// 创建所有音效
createSwapSound();
createMatchSound();
createComboSounds();
createDropSound();
