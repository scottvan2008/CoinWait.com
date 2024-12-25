export default function Chart() {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">奖金对照表</h2>
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">奖等</th>
              <th className="border border-gray-300 px-4 py-2">奖金</th>
              <th className="border border-gray-300 px-4 py-2">中奖条件</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">一等奖</td>
              <td className="border border-gray-300 px-4 py-2">500万元</td>
              <td className="border border-gray-300 px-4 py-2">6 红 + 1 蓝</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">二等奖</td>
              <td className="border border-gray-300 px-4 py-2">20万元</td>
              <td className="border border-gray-300 px-4 py-2">6 红 + 0 蓝</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">三等奖</td>
              <td className="border border-gray-300 px-4 py-2">3,000元</td>
              <td className="border border-gray-300 px-4 py-2">5 红 + 1 蓝</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">四等奖</td>
              <td className="border border-gray-300 px-4 py-2">200元</td>
              <td className="border border-gray-300 px-4 py-2">5 红 + 0 蓝 或 4 红 + 1 蓝</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">五等奖</td>
              <td className="border border-gray-300 px-4 py-2">10元</td>
              <td className="border border-gray-300 px-4 py-2">4 红 + 0 蓝 或 3 红 + 1 蓝</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">六等奖</td>
              <td className="border border-gray-300 px-4 py-2">5元</td>
              <td className="border border-gray-300 px-4 py-2">2 红 + 1 蓝 或 1 红 + 1 蓝 或 0 红 + 1 蓝</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  