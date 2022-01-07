import {
  HStack,
  Icon,
  ListItem,
  Text,
  useColorModeValue,
  useMenuDescendant,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { IconType } from 'react-icons/lib';
import { useKeyPressEvent } from 'react-use';
import { CmdPaletteContext } from 'src/providers/cmd-palette-provider';

type Props = {
  icon: IconType;
  title: string;
  onClick?: () => void;
  href?: string;
};

const CommandItem = ({ icon, title, onClick, href }: Props) => {
  const hoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const { focusedIndex, close } = useContext(CmdPaletteContext);
  const ref = useRef<HTMLLIElement>();
  const router = useRouter();
  const isExternal = href && href.startsWith('http');

  const { register, index } = useMenuDescendant();

  const isFocused = focusedIndex === index;

  useEffect(() => {
    if (ref && ref.current) {
      register(ref.current);
    }
  }, [ref, register]);

  const activateItem = () => {
    if (href) {
      if (isExternal) {
        window.open(href, 'blank');
      } else {
        router.push(href, href);
      }
    } else if (onClick) {
      onClick?.();
    }
    close();
  };

  useKeyPressEvent('Enter', () => {
    if (isFocused) {
      activateItem();
    }
  });

  return (
    <ListItem
      ref={ref}
      px={3}
      py={3}
      cursor='pointer'
      _hover={{ bg: hoverBg }}
      bg={isFocused ? hoverBg : 'transparent'}
      rounded='md'
      href={href}
      onClick={activateItem}
    >
      <HStack>
        <Icon as={icon} />
        <Text>{title}</Text>
        {isExternal && <Icon as={FiArrowUpRight} display='inline' />}
      </HStack>
    </ListItem>
  );
};

export default CommandItem;