---
slug: writing-good-unit-tests
title: 编写良好的单元测试
author: Wang Shenwei
author_url: https://github.com/weareoutman
author_image_url: https://avatars2.githubusercontent.com/u/2338946?s=460&v=4
---

:::note
本文转载自 https://wangshenwei.com/writing-good-unit-tests/ 。
:::

> “万物之始，大道至简”

本文尝试从简单的单元测试思想着手，探讨如何编写良好的单元测试。以下将主要基于 [TypeScript], [Jest], [React], [Enzyme] 给出示例。关于单元测试的[基本概念和重要性]不在本文讨论范围。

## 基本方法

编写单元测试的基本方法其实很简单：

1. 给定输入
2. 运行
3. 断言输出

而一个好的单元测试的要求也很简单：

- 覆盖足够的输入场景
- 进行充分的输出断言

一个最简单的例子：

```ts
// `add.ts`
function add(a: number, b: number): number {
  return a + b;
}
```

```ts
// `add.spec.ts`
test("add(1, 2) should return 3", () => {
  expect(add(1, 2)).toBe(3);
});
```

我们编写单元测试的步骤如下：

1. 给定输入：`1`, `2`
2. 运行： `add(...)`
3. 断言输出：`expect(...).toBe(3)`

是不是很简单？当然，真实业务场景下我们要测试的单元远比上述例子复杂得多。

- 输入更加复杂，除了普通的函数输入参数，还可能有外部的事件，因此难以覆盖所有场景
- 输出更加复杂，除了普通的函数输出结果，还可能有对外部的副作用，因此难以断言运行结果

> 这里提到的*输入*、*输出*不再是狭义上的函数输入、输出。我们将所有可能影响测试对象行为的外部因素都称之为输入，将所有测试对象运行后对外部造成的影响都称之为输出。这样理解之后，我们就可以化繁为简，将测试过程回归到前面提到的最基本的方法上。

所以编写良好的单元测试首先要做的就是厘清测试对象的输入、输出，掌握覆盖不同形式的输入、断言不同形式的输出的方法。我们将分开讨论它们。

## 输入

足够简单的输入让我们可以花更少的时间、覆盖更多的场景。输入的来源大致有以下几种：

- 普通变量参数
- 外部依赖发送的事件
- GUI 操作事件

编写测试覆盖它们的复杂度依次增大。除了第一个，其它都可以看作*外部事件*，也可以理解为*来自外界的副作用*。对于普通变量参数，我们只需构造这些参数即可完成*给定输入*的任务。而对于外部事件，我们要做的就是想办法触发这些事件。

我们依然看一个简单的例子：

```ts
// `MyComponent.ts`
window.addEventListener("resize", () => { ... });
```

如何覆盖？主动发送这个事件：

```ts
// `MyComponent.spec.ts`
test("MyComponent", () => {
  window.dispatchEvent(new Event("resize"));
  // ...
});
```

再看一个例子：

```ts
// `MyComponent.tsx`
const handleChange = (value: string): void => { ... };
return <Editor onChange={handleChange} />
```

如何覆盖依赖组件的特定事件？主动触发依赖组件的事件：

```ts
// `MyComponent.spec.tsx`
test("MyComponent", () => {
  const wrapper = shallow(<MyComponent />);
  wrapper.find(Editor).invoke("onChange")("faked value");
  // ...
});
```

## 输出

足够简单的输出让我们可以更容易地断言运行结果。输出的形态大致有以下几种：

- 普通变量输出
- GUI 的变化
- 外部依赖的调用

在测试中对它们进行断言的复杂度依次增大。除了第一个，其它都可以看作*对外界的副作用*。对于普通变量输出，我们只需简单地断言它的值即可。而对于对外界的副作用，我们要做的就是想办法断言这些副作用的影响。

我们继续看一个简单的例子：

```ts
// `handleClick.ts`
function handleClick(): void {
  history.push("/next/url");
}
```

如何断言？我们可以断言副作用的影响结果：

```ts
// `handleClick.spec.ts`
test("handleClick", () => {
  handleClick();
  expect(history.location.pathname).toBe("/next/url");
});
```

有时副作用所影响的结果难以断言，或者该依赖被 _Mocked_，那么我们可以监视该副作用的触发点是否被正确调用了：

```ts
// `handleClick.spec.ts`
test("handleClick", () => {
  const spyOnHistoryPush = jest.spyOn(history, "push");
  expect(spyOnHistoryPush).toBeCalledWith("/next/url");
});
```

再看一个 React 组件的例子：

```ts
// `MyComponent.tsx`
const handleValidation = (valid: boolean): void => {
  this.setState({ valid });
};
return (
  <Form.Item className={this.state.valid ? "valid" : "invalid"}>
    <Input />
  </Form.Item>
);
```

如何断言？判断依赖组件的变化：

```ts
// `MyComponent.spec.tsx`
test("MyComponent", () => {
  const wrapper = shallow(<MyComponent />);
  // ... after something trigger `handleValidation()`
  expect(wrapper.find(Form.Item).prop("className")).toBe("invalid");
});
```

始终记得要断言测试对象运行后对外界的副作用影响。

另外断言的目标应该是*对外的影响*，而不是*内部状态*，因为内部状态并不是测试对象的*输出*。一个错误的例子：

```ts
// `MyComponent.bad.spec.tsx`
expect(wrapper.instance().state.valid).toBe("invalid");
```

## 重构与拆分

更简单的输入、输出让我们可以更容易地编写好的单元测试，但往往实际情况是业务需求不断增长，组件内部逻辑不断复杂化，输入输出的形式形态更加多样化，为组件编写单元测试的难度也随之陡增。

**适时地重构与拆分**是解决这个问题的关键。在如今的前端组件化的模式下尤为重要，合理拆分后的组件可以让每个测试单元的输入输出都变得更少、更聚焦。诸如 React, [Redux] 等主流框架和工具推崇的[单向数据流]盛行的其中一个原因就是它们巧妙地让各个单元的输入来源、输出影响单一化，从而降低编写单元测试的难度，同时提升组件集成时的信心。

## 总结

编写良好的单元测试总结下来就是三条：

- 识别测试对象的输入、输出
- 掌握不同形态下的输入覆盖、输出断言的方法
- 适时地重构与拆分

希望以上内容对大家有所帮助。

[typescript]: https://www.typescriptlang.org/
[jest]: https://jestjs.io/
[react]: https://reactjs.org/
[enzyme]: https://airbnb.io/enzyme/
[redux]: https://redux.js.org/
[单向数据流]: https://flaviocopes.com/react-unidirectional-data-flow/
[基本概念和重要性]: https://zh.wikipedia.org/wiki/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95
