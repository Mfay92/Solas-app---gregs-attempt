import React, { Children, ReactNode } from 'react';

type ScrollStackProps = {
  children: ReactNode;
  offset?: number; // in rem
  cardHeight?: string; // e.g., '80vh'
};

/**
 * A container that creates a sticky card stacking effect on scroll.
 * Inspired by https://reactbits.dev/components/scroll-stack
 *
 * Each direct child of this component will be treated as a card in the stack.
 * The parent container of ScrollStack must be scrollable (e.g., have a fixed height and overflow-y: auto).
 */
const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  offset = 1,
  cardHeight = '80vh',
}) => {
  const cards = Children.toArray(children);
  const numCards = cards.length;

  // Calculate the total height needed for the scroll container
  // to ensure there's enough space to scroll past all sticky cards.
  // This is an approximation; the parent controls the actual scrollable area.
  const scrollContainerHeight = `calc(${numCards} * (${cardHeight} / 2))`;

  return (
    <div className="w-full" style={{ height: scrollContainerHeight }}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="sticky"
          style={{
            top: `${index * offset}rem`,
            zIndex: index + 1,
            height: cardHeight,
            // Scale cards further down the stack to give a depth effect.
            transform: `scale(${1 - (numCards - 1 - index) * 0.05})`,
            transformOrigin: 'top center',
          }}
        >
          {card}
        </div>
      ))}
    </div>
  );
};

export default ScrollStack;
