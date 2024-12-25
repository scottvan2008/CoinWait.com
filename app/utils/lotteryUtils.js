// 随机生成开奖结果
export const drawNumbers = () => {
  const red = []  // 用来存储红球号码
  while (red.length < 6) {
    const num = Math.floor(Math.random() * 33) + 1  // 随机生成1到33之间的数字
    if (!red.includes(num)) {  // 确保不重复
      red.push(num)
    }
  }
  const blue = Math.floor(Math.random() * 16) + 1  // 随机生成1到16之间的蓝球号码
  return { red: red.sort((a, b) => a - b), blue }  // 返回排序后的红球号码和蓝球号码
}

// 检查用户是否中奖
export const checkWin = (selectedRed, selectedBlue, drawnRed, drawnBlue) => {
  // 计算红球匹配的个数
  const redMatches = selectedRed.filter(num => drawnRed.includes(num)).length
  // 检查蓝球是否匹配
  const blueMatch = selectedBlue === drawnBlue

  // 根据匹配的个数返回相应的奖品
  if (redMatches === 6 && blueMatch) return { prize: 5000000, redMatches, blueMatch }  // 红球6个 + 蓝球中，中奖500万
  if (redMatches === 6) return { prize: 200000, redMatches, blueMatch }  // 红球6个中，中奖20万
  if (redMatches === 5 && blueMatch) return { prize: 3000, redMatches, blueMatch }  // 红球5个 + 蓝球中，中奖3000
  if (redMatches === 5 || (redMatches === 4 && blueMatch)) return { prize: 200, redMatches, blueMatch }  // 红球5个或红球4个+蓝球中，中奖200
  if (redMatches === 4 || (redMatches === 3 && blueMatch)) return { prize: 10, redMatches, blueMatch }  // 红球4个或红球3个+蓝球中，中奖10
  if ((redMatches === 2 && blueMatch) || (redMatches === 1 && blueMatch) || (redMatches === 0 && blueMatch)) return { prize: 5, redMatches, blueMatch }  // 红球2个或更少，且蓝球中，中奖5

  return { prize: 0, redMatches, blueMatch }  // 没中奖
}
