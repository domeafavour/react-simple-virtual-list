import React, { useEffect, useRef, useState } from 'react';

export type BaseItem = { key: React.Key };

type GetItemHeight = (index: number) => number;

interface Props<R extends BaseItem> {
  threshold?: number;
  height: number;
  data: R[];
  itemHeight: number | GetItemHeight;
  children: (
    style: React.CSSProperties,
    item: R,
    index: number
  ) => React.ReactNode;
}

export type { Props as SimpleVirtualListProps };

type ItemInfo<T> = {
  top: number;
  height: number;
  index: number;
  item: T;
};

function SimpleVirtualList<R extends BaseItem>(
  props: Props<R>
): React.ReactElement {
  const { data, height, itemHeight, threshold = 100, children } = props;
  const [itemInfos, setItemInfos] = useState<ItemInfo<R>[]>(() => []);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const scrollTopRef = useRef(0);

  const [actualRenderInfos, setActualRenderInfos] = useState<ItemInfo<R>[]>(
    () => []
  );

  const rerender = () => {
    const scrollTop = scrollTopRef.current;
    setActualRenderInfos(
      itemInfos.filter(
        (item) =>
          scrollTop <= item.top + threshold &&
          scrollTop + height >= item.top + item.height - threshold
      )
    );
  };

  useEffect(() => {
    rerender();
  }, [itemInfos]);

  useEffect(() => {
    let totalHeight = 0;
    const infos: ItemInfo<R>[] = [];
    for (let i = 0; i < data.length; i += 1) {
      const currentHeight =
        typeof itemHeight === 'function' ? itemHeight(i) : itemHeight;

      infos.push({
        height: currentHeight,
        top: totalHeight,
        item: data[i],
        index: i,
      });
      totalHeight += currentHeight;
    }
    setWrapperHeight(totalHeight);
    setItemInfos(infos);
  }, [data]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    scrollTopRef.current = e.currentTarget.scrollTop;
    rerender();
  };

  return (
    <div style={{ overflowY: 'auto', height }} onScroll={onScroll}>
      <div style={{ height: wrapperHeight, position: 'relative' }}>
        {actualRenderInfos.map((item) => {
          return (
            <React.Fragment key={item.item.key}>
              {children(
                {
                  position: 'absolute',
                  top: item.top,
                  height: item.height,
                  width: '100%',
                  transition: 'all .3s',
                },
                item.item,
                item.index
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default SimpleVirtualList;
