'use client'

import { useState } from 'react'
import NumberSelector from './components/NumberSelector'
import Results from './components/Results'
import { drawNumbers, checkWin } from './utils/lotteryUtils'
import Chart from './components/Chart' // 引入 Chart 组件

export default function Home() {
  const [funds, setFunds] = useState(100) // 初始资金为100
  const [selectedRed, setSelectedRed] = useState([]) // 选中的红球
  const [selectedBlue, setSelectedBlue] = useState(null) // 选中的蓝球
  const [drawnNumbers, setDrawnNumbers] = useState(null) // 抽取的号码
  const [result, setResult] = useState(null) // 中奖结果

  const handlePlay = () => {
    // 检查用户是否有足够的资金
    if (funds <= 0) {
      alert('您的余额不足，无法继续游戏。')
      return
    }

    // 检查是否选择了6个红球和1个蓝球
    if (selectedRed.length !== 6 || !selectedBlue) {
      alert('请选中6个红球和1个蓝球')
      return
    }

    // 抽取随机号码
    const drawn = drawNumbers()
    setDrawnNumbers(drawn)

    // 检查是否中奖
    const winResult = checkWin(selectedRed, selectedBlue, drawn.red, drawn.blue)
    setResult(winResult)

    // 根据中奖结果更新资金
    if (winResult.prize > 0) {
      setFunds(funds + winResult.prize)
    } else {
      setFunds(funds - 2) // 每次游戏扣除2元
    }
  }

  const resetSelection = () => {
    // 重置选择状态
    setSelectedRed([])
    setSelectedBlue(null)
    setDrawnNumbers(null)
    setResult(null)
  }

  const resetFunds = () => {
    // 重置资金为初始值
    setFunds(100)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">双色球小游戏</h1>

      {/* 游戏区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-xl font-semibold mb-4">余额: ¥{funds}</p>
        {/* 数字选择器组件 */}
        <NumberSelector
          selectedRed={selectedRed}
          setSelectedRed={setSelectedRed}
          selectedBlue={selectedBlue}
          setSelectedBlue={setSelectedBlue}
        />
        
        {/* 按钮区域 */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handlePlay}
            className={`${
              funds <= 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-bold py-2 px-4 rounded`}
            disabled={funds <= 1} // 如果余额小于等于1，禁用按钮
          >
            开奖
          </button>
          <button
            onClick={resetSelection}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            清空号码
          </button>
          {/* 重置资金按钮 */}
          <button
            onClick={resetFunds}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            重置资金
          </button>
        </div>
      </div>

      {/* 结果显示 */}
      {drawnNumbers && (
        <Results 
          drawnNumbers={drawnNumbers} 
          result={result} 
          selectedRed={selectedRed} 
          selectedBlue={selectedBlue} 
        />
      )}

      {/* 图表显示 */}
      <div className="mt-8">
        <Chart /> {/* 渲染 Chart 组件 */}
      </div>
    </main>
  )
}
