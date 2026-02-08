// data/voices.ts
import type { VoicesData } from '../src/types/voices'

export const voicesData: Record<string, VoicesData> = {
    parents: {
    border: {
        color: '#000',
        width: 2,
        radius: 10,
    },
    background: {
        direction: 'vertical',
        colors: ['#ffffff', '#ffffff'],
    },
    textColor: '#000000',
    boxColor: '#ffffff',
    highlightColor: '#e6452d',

    items: [
        {
        text: '入塾を決める前に相談できたのが安心でした',
        highlight: '入塾を決める前',
        author: '高3・保護者',
        align: 'left',
        },
        {
        text: '無理に勧められなかったので信頼できました',
        highlight: '無理に勧められなかった',
        author: '高2・保護者',
        align: 'left',
        },
        {
        text: '地理は最初暗記科目だと思っていましたが、\nお話を聞くうちに考える科目だと気づけました',
        highlight: '暗記科目',
        author: '高3・保護者',
        align: 'left',
        },
    ],
    },


    top: {
    widthPercent: 60,
    border: {
        color: '#000',
        width: 2,
        radius: 10,
    },
    background: {
        direction: 'vertical',
        colors: ['#ffffff', '#ffffff'],
    },
    textColor: '#000000',
    boxColor: '#ffffff',
    highlightColor: '#e6452d',

    items: [
        {
        text: '高校地理の勉強に\nお悩みの皆様',
        highlight: '高校地理',
        align: 'center',
        }
    ],
    },

  teachers: {
    border: {
      color: '#333',
      width: 2,
      radius: 10,
    },
    background: {
      direction: 'vertical',
      colors: ['#fff5f5', '#ffffff'],
    },
    textColor: '#000000',
    boxColor: '#ffffff',
    items: [
      {
        text: '理解重視の指導ができています',
        author: '担当講師',
        align: 'right',
      },
    ],
  },
}
