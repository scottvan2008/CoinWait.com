const Results = ({ drawnNumbers, result, selectedRed, selectedBlue }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">开奖结果</h2>
      
      {/* 显示开奖的号码 */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">开奖号码</h3>
        <div className="flex space-x-2">
          {drawnNumbers.red.map((num, index) => (
            <span
              key={index}
              className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              {num.toString().padStart(2, '0')}  {/* 显示红球号码，确保是两位数 */}
            </span>
          ))}
          <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {drawnNumbers.blue.toString().padStart(2, '0')}  {/* 显示蓝球号码，确保是两位数 */}
          </span>
        </div>
      </div>

      {/* 显示用户选择的号码 */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">你选的号码</h3>
        <div className="flex space-x-2">
          {selectedRed.map((num, index) => (
            <span
              key={index}
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${
                drawnNumbers.red.includes(num) ? 'bg-red-600' : 'bg-red-300'  // 如果用户选中的红球是开奖红球，则标为深红色，否则为浅红色
              }`}
            >
              {num.toString().padStart(2, '0')}  {/* 显示红球号码，确保是两位数 */}
            </span>
          ))}
          <span
            className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${
              drawnNumbers.blue === selectedBlue ? 'bg-blue-600' : 'bg-blue-300'  // 如果用户选中的蓝球是开奖蓝球，则标为深蓝色，否则为浅蓝色
            }`}
          >
            {selectedBlue?.toString().padStart(2, '0')}  {/* 显示蓝球号码，确保是两位数 */}
          </span>
        </div>
      </div>

      {/* 显示中奖情况 */}
      <div>
        <h3 className="text-xl font-semibold mb-2">中奖情况</h3>
        <p className="text-lg">
          {result.prize > 0
            ? `恭喜中奖 ¥${result.prize.toLocaleString()}`  // 如果中奖，显示奖金
            : "您没中奖，谢谢惠顾"}  
            {/*  如果没有中奖，显示安慰语 */}
        </p>
        {result.prize > 0 && (
          <p className="text-md mt-2">
            你中了 {result.redMatches} 个红{result.redMatches === 1 ? '球' : '球'}  {/* 显示红球匹配情况 */}
            和 {result.blueMatch ? '1个蓝球' : '0个蓝球'}.
          </p>
        )}
      </div>
    </div>
  );
};

export default Results;
