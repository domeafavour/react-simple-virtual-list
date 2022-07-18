import React, { useRef, useState } from 'react';
import SimpleVirtualList, { BaseItem } from './components/SimpleVirtualList';

type ItemType = BaseItem & {
  title: string;
  checked: boolean;
};

function randomTitle() {
  return Math.random().toString(16).substring(2);
}

function randomHeight(index: number) {
  if (index % 2 === 0) {
    return 40;
  }
  if (index % 3 === 0) {
    return 60;
  }
  return 80;
}

function App() {
  const [list, setList] = useState<ItemType[]>(() =>
    Array.from<any, ItemType>({ length: 50000 }, () => {
      return {
        checked: false,
        key: Math.random(),
        title: randomTitle(),
      };
    })
  );

  const checkedAllRef = useRef(false);

  function toggleCheckAll() {
    setList((items) =>
      items.map((item) => ({ ...item, checked: !checkedAllRef.current }))
    );
    checkedAllRef.current = !checkedAllRef.current;
  }

  function toggleChecked(index: number) {
    setList((items) =>
      items.map((item, idx) => {
        if (index === idx) {
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );
  }

  function renderItem(
    style: React.CSSProperties,
    item: ItemType,
    index: number
  ) {
    return (
      <div
        style={{
          ...style,
          cursor: 'pointer',
          boxSizing: 'border-box',
          background: item.checked ? 'yellow' : 'transparent',
          borderBottom: '1px solid #f00',
        }}
        onClick={() => {
          toggleChecked(index);
        }}
      >
        {index}: {item.title}
      </div>
    );
  }

  return (
    <div>
      <SimpleVirtualList<ItemType>
        data={list}
        height={300}
        itemHeight={randomHeight}
      >
        {renderItem}
      </SimpleVirtualList>
      <button onClick={toggleCheckAll}>toggle check all</button>
    </div>
  );
}

export default App;
