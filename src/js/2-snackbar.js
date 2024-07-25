import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.querySelector('.form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Отримання значень з форми
    const delay = Number(event.target.elements.delay.value);
    const state = event.target.elements.state.value;

    // Функція для створення промісу
    const createPromise = (delay, state) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (state === 'fulfilled') {
                    resolve(delay);
                } else if (state === 'rejected') {
                    reject(delay);
                }
            }, delay);
        });
    };

    // Створення промісу
    createPromise(delay, state)
        .then((result) => {
            iziToast.success({
                title: 'Success',
                message: `✅ Fulfilled promise in ${result}ms`,
                position: 'topRight'
            });
        })
        .catch((error) => {
            iziToast.error({
                title: 'Error',
                message: `❌ Rejected promise in ${error}ms`,
                position: 'topRight'
            });
        });
});
