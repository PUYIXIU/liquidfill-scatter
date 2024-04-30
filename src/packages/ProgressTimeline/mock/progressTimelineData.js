// 按开始时间排序
import dayjs from "dayjs";



/**
 * 根据起始时间和总工时，返回模拟的工时分布
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param totalHours 总工时
 * @returns {*[]}
 */
export function getHourList(startTime, endTime, totalHours){
    let result = []
    let start = dayjs(startTime)
    let end = dayjs(endTime)
    // 总天数
    let dayDiff = end.diff(start, 'day')+1

    const avg = totalHours / dayDiff // 平均值
    const maxDiff = avg

    while(!start.isAfter(end)){
        result.push([
            start.format('YYYY-MM-DD'),
            Math.floor(avg*(Math.random()+0.5))
        ])
        start = start.add(1,'day')
    }

    return result
}

// 配色方案
export const colorList = [
    {
        mainColor:'#5788FE',
        subColor:[
            '#FB9B61',
            '#FF6C78',
        ]
    },
    {
        mainColor:'#f97374',
        subColor:[
            '#f99a60',
            '#d62b39',
        ]
    },
    {
        mainColor:'#79bff2',
        subColor:[
            '#608bf9',
            '#2b79d6',
        ]
    },
]


export const MockProgressTimelineData = [
    {
        id:'task1',
        taskName:'运维宣传图要点分析',
        startTime:'2024-01-01', // 开始时间
        endTime:'2024-03-05', // 结束时间
        progress:80, // 进度
        children:[ // 参与者
            {
                id:'person1',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-01-01','2024-03-05', 300)
                ]
            },
            {
                id:'person2',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-01-01','2024-03-05', 300)
                ]
            },
            {
                id:'person3',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-01-01','2024-03-05', 300)
                ]
            }

        ]

    },

    {
        id:'task2',
        taskName:'运维宣传图要点分析',
        startTime:'2024-01-01', // 开始时间
        endTime:'2024-05-05', // 结束时间
        progress:80, // 进度
        children:[ // 参与者
            {
                id:'person1',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-04-01','2024-05-05', 100)
                ]
            },
            {
                id:'person2',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-05-01','2024-05-05', 10)
                ]
            },
            {
                id:'person3',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-04-19','2024-05-05', 100)
                ]
            }

        ]

    },
    {
        id:'task3',
        taskName:'运维宣传图要点分析',
        startTime:'2024-09-01', // 开始时间
        endTime:'2024-12-05', // 结束时间
        progress:80, // 进度
        children:[ // 参与者
            {
                id:'person1',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-09-01','2024-12-05', 300)
                ]
            },
            {
                id:'person2',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-04-01','2024-05-05', 100)
                ]
            },
            {
                id:'person3',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-04-19','2024-05-05', 100)
                ]
            }

        ]

    },
    {
        id:'task4',
        taskName:'运维宣传图要点分析',
        startTime:'2024-09-01', // 开始时间
        endTime:'2024-12-05', // 结束时间
        progress:80, // 进度
        children:[ // 参与者
            {
                id:'person1',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-09-01','2024-12-05', 300)
                ]
            },
            {
                id:'person2',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-04-01','2024-05-05', 100)
                ]
            },
            {
                id:'person3',
                name:'李连杰',
                totalHour:300, // 总工时
                percent:57, // 在当前总工时中的占比
                hourList:[ // 每日工时列表
                    // ['2024-01-01',8],
                    // ['2024-01-02',4],
                    // ['2024-01-03',5],
                    // ...
                    // ['2024-03-05',5],
                    ...getHourList('2024-04-19','2024-05-05', 100)
                ]
            }

        ]

    }
]
