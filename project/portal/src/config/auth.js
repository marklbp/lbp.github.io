export default {
  template: {
    template: {
      label: {
        show: 1,
        edit: 1,
        rules: [{ required: true, message: '必填', trigger: 'blur' }],
        name: '名称'
      },
      category: {
        show: 1,
        edit: 1,
        name: '分类'
      },
      description: {
        show: 1,
        edit: 1,
        name: '描述'
      },
      knowledge: {
        show: 1,
        edit: 1,
        name: '相关知识'
      }
    },
    task: {
      label: {
        show: 1,
        edit: 1,
        rules: [{ required: true, message: '必填', trigger: 'blur' }],
        name: '名称'
      },
      assignee: {
        show: 1,
        edit: 1,
        name: '执行人'
      },
      description: {
        show: 1,
        edit: 1,
        name: '描述'
      },
      tools: {
        show: 1,
        edit: 1,
        delete: 1,
        name: '工具'
      },
      knowledge: {
        show: 1,
        edit: 1,
        name: '相关知识'
      },
      executorPost: {
        show: 1,
        edit: 0,
        name: '推荐岗位'
      }
    },
    check: {
      label: {
        show: 1,
        edit: 1,
        rules: [{ required: true, message: '必填', trigger: 'blur' }],
        name: '名称'
      },
      assignee: {
        show: 1,
        edit: 1,
        name: '执行人'
      },
      description: {
        show: 1,
        edit: 1,
        name: '描述'
      },
      agree: {
        show: 1,
        edit: 1,
        rules: [{ required: true, message: '必填', trigger: 'change' }]
      },
      reject: {
        show: 1,
        edit: 1,
        rules: [{ required: true, message: '必填', trigger: 'change' }]
      },
      executorPost: {
        show: 1,
        edit: 0,
        name: '推荐岗位'
      }
    },
    flow: {
      label: {
        show: 1,
        edit: 0,
        name: '名称'
      },
      subFlow: {
        show: 1,
        edit: 1,
        name: '流程模板',
        rules: [{ required: true, message: '必填', trigger: 'change' }]
      },
      description: {
        show: 1,
        edit: 0,
        name: '描述'
      }
    },
    robot: {
      label: {
        show: 1,
        edit: 1,
        name: '节点名称',
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      service: {
        show: 1,
        edit: 1,
        name: '选择服务',
        rules: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  start: {
    template: {
      label: {
        show: 1,
        edit: 1,
        rules: [{ required: true, message: '必填', trigger: 'blur' }],
        name: '名称'
      },
      description: {
        show: 1,
        edit: 1,
        name: '描述'
      },
      knowledge: {
        show: 1,
        edit: 0,
        name: '相关知识'
      },
      startTime: { show: 1, edit: 1, name: '开始时间' },
      priority: { show: 1, edit: 1, name: '优先级' },
      tags: { show: 1, edit: 1, name: '标签' },
      copyPerson: { show: 1, edit: 1, name: '抄送人' },
      attachment: { show: 1, edit: 1, name: '附件' },
      endTime: { show: 1, edit: 1, name: '截止时间' }
    },
    task: {
      label: {
        show: 1,
        edit: 0,
        name: '名称'
      },
      assignee: { show: 1, edit: 1, name: '执行人' },
      startTime: { show: 1, edit: 1, name: '开始时间' },
      endTime: { show: 1, edit: 1, name: '截止时间' },
      description: { show: 1, edit: 1, name: '描述' },
      tools: { show: 1, edit: 1, name: '工具' },
      knowledge: { show: 1, name: '相关知识' },
      executorPost: {
        show: 1,
        edit: 0,
        name: '推荐岗位'
      }
    },
    check: {
      label: {
        show: 1,
        name: '名称'
      },
      assignee: { show: 1, edit: 1, name: '执行人' },
      description: { show: 1, edit: 1, name: '描述' },
      startTime: { show: 1, edit: 1, name: '开始时间' },
      endTime: { show: 1, edit: 1, name: '截止时间' },
      agree: { show: 1 },
      reject: { show: 1 },
      executorPost: {
        show: 1,
        edit: 0,
        name: '推荐岗位'
      }
    },
    flow: {
      label: {
        show: 1,
        edit: 0,
        name: '名称'
      },
      description: {
        show: 1,
        edit: 0,
        name: '描述'
      }
    },
    robot: {
      label: {
        show: 1,
        edit: 0,
        name: '节点名称',
        rules: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      service: {
        show: 1,
        edit: 0,
        name: '选择服务',
        rules: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },

  independentTask: {
    // 0: '待处理' 1: '进行中' 2: '已完成' 3: '已暂停' 4: '取消'
    0: {
      // 角色为创建者
      creator: {
        // 标题 1:可编辑 0： 不可编辑
        label: 1,
        // 任务状态能操作的集合
        status: [1, 2, 3],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 1,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 1,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 1,
        // 描述 1：可以更改  0： 不能操作
        description: 1,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 1,
        // 工具 1：可以增删改用跳转 2: 智能机用 0： 只能用跳转
        tools: 1,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 1,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 1,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为执行者
      assignee: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0,
        // 任务状态能操作的集合
        status: [1, 2],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 1,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 0,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0,
        // 描述 1：可以更改  0： 不能操作
        description: 0,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 2,
        // 批注 1：只能删改自己的
        annotation: 1
      },
      // 角色为抄送者
      copyor: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0, // ✔
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0, // ✔
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1, // ✔
        // 优先级  1：可以更改  0： 不能操作
        priority: 0, // ✔
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0, // ✔
        // 描述 1：可以更改  0： 不能操作
        description: 0, // ✔
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 只能用跳转
        tools: 2,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0, // ✔ 支持控制增加
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 0,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 0,
        // 批注 1：真能删改自己的
        annotation: 1
      }
    },
    1: {
      // 角色为创建者
      creator: {
        // 标题 1:可编辑 0： 不可编辑
        label: 1,
        // 任务状态能操作的集合
        status: [2, 3],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 1,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 1,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 1,
        // 描述 1：可以更改  0： 不能操作
        description: 1,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 1,
        // 工具 1：可以增删改用跳转 2: 智能机用 0： 只能用跳转
        tools: 1,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 1,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 1,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为执行者
      assignee: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0,
        // 任务状态能操作的集合
        status: [2, 3],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 1,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 0,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0,
        // 描述 1：可以更改  0： 不能操作
        description: 0,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 2,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为抄送者
      copyor: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0, // ✔
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0, // ✔
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1, // ✔
        // 优先级  1：可以更改  0： 不能操作
        priority: 0, // ✔
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0, // ✔
        // 描述 1：可以更改  0： 不能操作
        description: 0, // ✔
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 只能用跳转
        tools: 2,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0, // ✔ 支持控制增加
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 0,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 0,
        // 批注 1：真能删改自己的
        annotation: 1
      }
    },
    2: {
      // 角色为创建者
      creator: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0,
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 0,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0,
        // 描述 1：可以更改  0： 不能操作
        description: 0,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 智能机用 0： 只能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 1,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为执行者
      assignee: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0,
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 0,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0,
        // 描述 1：可以更改  0： 不能操作
        description: 0,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 2,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为抄送者
      copyor: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0, // ✔
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0, // ✔
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1, // ✔
        // 优先级  1：可以更改  0： 不能操作
        priority: 0, // ✔
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0, // ✔
        // 描述 1：可以更改  0： 不能操作
        description: 0, // ✔
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 只能用跳转
        tools: 2,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0, // ✔ 支持控制增加
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 0,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 0,
        // 批注 1：真能删改自己的
        annotation: 1
      }
    },
    3: {
      // 角色为创建者
      creator: {
        // 标题 1:可编辑 0： 不可编辑
        label: 1,
        // 任务状态能操作的集合
        status: [0, 1, 2],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 1,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 1,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 1,
        // 描述 1：可以更改  0： 不能操作
        description: 1,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 1,
        // 工具 1：可以增删改用跳转 2: 智能机用 0： 只能用跳转
        tools: 1,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 1,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 1,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为执行者
      assignee: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0,
        // 任务状态能操作的集合
        status: [0, 1, 2],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 1,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1,
        // 优先级  1：可以更改  0： 不能操作
        priority: 0,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0,
        // 描述 1：可以更改  0： 不能操作
        description: 0,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 2,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为抄送者
      copyor: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0, // ✔
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0, // ✔
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 1, // ✔
        // 优先级  1：可以更改  0： 不能操作
        priority: 0, // ✔
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0, // ✔
        // 描述 1：可以更改  0： 不能操作
        description: 0, // ✔
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 只能用跳转
        tools: 2,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0, // ✔ 支持控制增加
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 0,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 0,
        // 批注 1：真能删改自己的
        annotation: 1
      }
    },
    4: {
      // 角色为创建者
      creator: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0,
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 0,
        // 优先级  1：可以更改  0： 不能操作
        priority: 0,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0,
        // 描述 1：可以更改  0： 不能操作
        description: 0,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 智能机用 0： 只能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 1,
        // 批注 1：真能删改自己的
        annotation: 1
      },
      // 角色为执行者
      assignee: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0,
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0,
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 0,
        // 优先级  1：可以更改  0： 不能操作
        priority: 0,
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0,
        // 描述 1：可以更改  0： 不能操作
        description: 0,
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0,
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 1,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 2,
        // 批注 1：真能删改自己的
        annotation: 0
      },
      // 角色为抄送者
      copyor: {
        // 标题 1:可编辑 0： 不可编辑
        label: 0, // ✔
        // 任务状态能操作的集合
        status: [],
        // 执行者字段  1：可以更改  0： 不能更改
        assignee: 0, // ✔
        // 抄送者字段  1：只能新增不能更改  0： 不能操作
        copyor: 0, // ✔
        // 优先级  1：可以更改  0： 不能操作
        priority: 0, // ✔
        // 任务时间  1：可以更改  0： 不能操作
        endTime: 0, // ✔
        // 描述 1：可以更改  0： 不能操作
        description: 0, // ✔
        // 附件 0：不可改增删 1: 可改增删
        enclosure: 0,
        // 工具 1：可以增删改用跳转 2: 只能用 0： 只能用跳转
        tools: 0,
        // 父任务 0：不可编辑
        parent: 0,
        // 子任务 0：不可改增删 1: 可改增 2：可改增删
        sub: 0, // ✔ 支持控制增加
        // 交付资料-成果描述 1: 改，增，删 0:不能操作
        deliveryDescription: 0,
        // 交付文件 1: 改，增，删,下载 0:只能下载 2：改，增，删
        deliveryFile: 0,
        // 批注 1：真能删改自己的
        annotation: 0
      }
    }
  }
}
