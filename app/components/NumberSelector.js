import { useState } from 'react'

const NumberSelector = ({ selectedRed, setSelectedRed, selectedBlue, setSelectedBlue }) => {
  // 创建红球和蓝球号码数组
  const redNumbers = Array.from({ length: 33 }, (_, i) => i + 1)  // 红球号码从1到33
  const blueNumbers = Array.from({ length: 16 }, (_, i) => i + 1) // 蓝球号码从1到16

  // 切换选中的红球号码
  const toggleRed = (num) => {
    // 如果红球已经被选中，取消选择
    if (selectedRed.includes(num)) {
      setSelectedRed(selectedRed.filter(n => n !== num))
    } else if (selectedRed.length < 6) {  // 如果红球未满6个，添加选择
      setSelectedRed([...selectedRed, num])
    }
  }

  return (
    <div>
      {/* 选择号码的标题 */}
      <h2 className="text-2xl font-semibold mb-4">选择你的号码</h2>
      
      {/* 红球选择区域 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">红球 (选6个)</h3>
        <div className="grid grid-cols-6 gap-2 md:grid-cols-11">
          {redNumbers.map(num => (
            <button
              key={num}
              onClick={() => toggleRed(num)}  // 点击红球时调用切换函数
              className={`w-10 h-10 rounded-full ${
                selectedRed.includes(num)  // 如果红球已被选中，设置为红色
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 hover:bg-red-100'  // 否则设置为灰色并提供悬停效果
              }`}
            >
              {num.toString().padStart(2, '0')}  {/* 显示号码，确保两位数 */}
            </button>
          ))}
        </div>
      </div>
      
      {/* 蓝球选择区域 */}
      <div>
        <h3 className="text-xl font-semibold mb-2">蓝球 (选1个)</h3>
        <div className="grid grid-cols-8 gap-2">
          {blueNumbers.map(num => (
            <button
              key={num}
              onClick={() => setSelectedBlue(num)}  // 点击蓝球时设置选中的蓝球
              className={`w-10 h-10 rounded-full ${
                selectedBlue === num  // 如果蓝球已被选中，设置为蓝色
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-blue-100'  // 否则设置为灰色并提供悬停效果
              }`}
            >
              {num.toString().padStart(2, '0')}  {/* 显示号码，确保两位数 */}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NumberSelector
