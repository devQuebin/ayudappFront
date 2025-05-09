import React from "react";
import { Accordion, Flex, Span, Text } from "@chakra-ui/react";

function faq() {
  const items = [
    { value: "a", title: "Pregunta numero 1", text: "Respeusta numero 1" },
    { value: "b", title: "Pregunta numero 2", text: "Respeusta numero 2" },
    { value: "c", title: "Pregunta numero 3", text: "Respeusta numero 3" },
  ];

  return (
    <Flex
      mt={10}
      display="flex"
      direction="column"
      justify="center"
      align="center"
      py={10}
    >
      <Text fontSize={50} mb={4}>
        Preguntas frecuentes
      </Text>
      <Flex p={8}>
        <Accordion.Root collapsible defaultValue={["a"]}>
          {items.map((item, index) => (
            <Accordion.Item key={index} value={item.value}>
              <Accordion.ItemTrigger>
                <Span flex="1">{item.title}</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Flex>
    </Flex>
  );
}

export default faq;
