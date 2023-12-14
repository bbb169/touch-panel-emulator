import ffi from 'ffi-napi';

// 你需要替换为你的系统的实际库路径
const foundationPath = '/System/Library/Frameworks/Foundation.framework/Foundation';
const appKitPath = '/System/Library/Frameworks/AppKit.framework/AppKit';

const Foundation = ffi.Library(foundationPath, {
  NSClassFromString: ['pointer', ['string']],
});

const AppKit = ffi.Library(appKitPath, {
  NSEvent: ['pointer', ['pointer', 'pointer', 'float', 'ulong', 'ulong', 'pointer', 'int', 'int', 'int', 'int', 'int']],
});

// 获取NSEvent类
const NSEvent = Foundation.NSClassFromString('NSEvent');

// 定义事件类型
const NSEventTypeGesture = 29; // 这是手势事件的类型

// 创建手势事件
const createGestureEvent = () => {
  const event = AppKit.NSEvent(
    null, // 类型为nil，因为我们只是创建事件
    null,
    0.0,
    0, // 序列号
    Date.now(),
    0, // Window ID
    null, // Context
    0, // 坐标系
    0, // 动作标识符
    1, // 数字手势的个数
    1 // 手势轨迹的个数
  );

  return event;
};

// 使用手势事件
const gestureEvent = createGestureEvent();

// 发送手势事件
AppKit.objc_msgSend(gestureEvent, 'postEvent', true);
