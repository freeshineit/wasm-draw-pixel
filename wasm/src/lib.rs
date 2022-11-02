use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc_WeeAlloc::INIT;

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct RGB {
    r: u8,
    g: u8,
    b: u8,
}
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Image {
    width: usize,
    height: usize,
    cells: Vec<RGB>,
}

#[wasm_bindgen]
impl Image {
    // 结构体 constructor
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> Self {
        let mut cells = Vec::new();
        cells.resize(
            width * height,
            RGB {
                r: 255,
                g: 255,
                b: 255,
            },
        );

        Image {
            width,
            height,
            cells,
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.height
    }

    pub fn cells(&self) -> Vec<u8> {
        self.cells
            .iter()
            .map(|&rgb| vec![rgb.r, rgb.g, rgb.b])
            .collect::<Vec<Vec<u8>>>()
            .concat()
    }

    pub fn brush(&mut self, x: usize, y: usize, color: Vec<u8>) -> Option<Image> {
        let index = (y * self.width) + x;

        let color = RGB {
            r: color[0],
            g: color[1],
            b: color[2],
        };

        // TODO: 同一种颜色 不在重新设置 避免多余缓存
        if self.cells[index] == color {
            None
        } else {
            self.cells[index] = color;

            Some(Image {
                width: self.width,
                height: self.height,
                cells: self.cells.clone(),
            })
        }
    }
}

pub struct UndoQueue<T> {
    queue: Vec<T>,
    index: usize, //
}

impl<T: Clone> UndoQueue<T> {
    // TODO: Init UndoQueue
    pub fn new(entry: T) -> UndoQueue<T> {
        UndoQueue {
            queue: vec![entry],
            index: 0,
        }
    }

    pub fn current(&self) -> T {
        self.queue[self.index].clone()
    }

    pub fn push(&mut self, entry: T) {
        self.queue.truncate(self.index + 1);
        self.queue.push(entry);
        self.index += 1;
    }

    pub fn undo(&mut self) {
        if self.index >= 1 {
            self.index -= 1
        }
    }

    pub fn redo(&mut self) {
        if self.index < (self.queue.len() - 1) {
            self.index += 1
        }
    }

    pub fn clear(&mut self, entry: T) {
        self.queue.truncate(self.index + 1);
        self.queue.push(entry);
        self.index += 1;
    }
}

#[wasm_bindgen]
pub struct InternalState {
    undo_queue: UndoQueue<Image>,
}

#[wasm_bindgen]
impl InternalState {
    // TODO: Init InternalState
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> Self {
        InternalState {
            undo_queue: UndoQueue::new(Image::new(width, height)),
        }
    }

    pub fn image(&self) -> Image {
        self.undo_queue.current()
    }

    pub fn brush(&mut self, x: usize, y: usize, color: Vec<u8>) {
        let mut image = self.undo_queue.current();
        let option_image = image.brush(x, y, color);

        match option_image {
            Some(new_image) => {
                self.undo_queue.push(new_image);
            }
            None => {}
        };
    }

    pub fn undo(&mut self) {
        self.undo_queue.undo()
    }

    pub fn redo(&mut self) {
        self.undo_queue.redo()
    }

    pub fn clear(&mut self) {
        self.undo_queue.clear(Image::new(40, 40))
    }
}
