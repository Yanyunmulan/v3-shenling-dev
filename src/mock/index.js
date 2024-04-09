import Mock from 'mockjs'

export default [
  {
    url: '/api/list',
    method: 'get',
    response: ({ query }) => {
      const total = 45
      const page = Number(query.page || 1)
      const pageSize = Number(query.pageSize || 10)
      const pageTotal = Math.ceil(total / pageSize)
      const list = []

      for (let i = 0; i < pageSize; i++) {
        list.push(
          Mock.mock({
            id: '@id',
            title: '@ctitle(20,30)',
            author: '@cname',
            time: '@date',
            image: '@image(200x150,@color)',
          }),
        )
      }

      return {
        code: 0,
        data: {
          page,
          total,
          pageTotal,
          list,
        },
      }
    },
  },
  {
    url: '/api/getPermission',
    method: 'get',
    response: ({ query }) => {
      let data = []
      if (query.role === 'admin') {
        data = [
          {
            name: 'base',
            children: ['base-department', 'base-departwork', 'base-freight'],
          },
          {
            name: 'business',
            children: ['business-orderlist', 'business-businesslist'],
          },
          {
            name: 'car',
            children: ['car-carType', 'car-carList', 'car-carCheck'],
          },
          {
            name: 'dispatch',
            children: ['dispatch-task', 'dispatch-line', 'dispatch-pickWork', 'dispatch-dispatch'],
          },
          {
            name: 'employee',
            children: ['employee-courier', 'employee-driver', 'employee-workArrange'],
          },
        ]
      } else if (query.role === 'employee') {
        data = [
          {
            name: 'base',
            children: ['base-department'],
          },
        ]
      }
      return {
        code: 200,
        data,
      }
    },
  },
]
