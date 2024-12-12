document.getElementById('mnemonicForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const startAddressInput = document.getElementById('startAddress').value;
    const startAddress = parseInt(startAddressInput, 10);
    const mnemonics = document.getElementById('mnemonics').value;
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!/^\d{4}$/.test(startAddressInput)) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('p-4', 'rounded-md', 'shadow-sm', 'bg-red-100', 'text-red-800');
        errorDiv.innerHTML = `<strong>Error:</strong> Start address must be a 4-digit number.`;
        resultsContainer.appendChild(errorDiv);
        return;
    }

    const lookupTable = [
        { mnemonic: "LDA", opcode: "3A" }, { mnemonic: "STA", opcode: "32" },
        { mnemonic: "MOV B,A", opcode: "47" }, { mnemonic: "MOV A,C", opcode: "79" },
        { mnemonic: "ADD B", opcode: "80" }, { mnemonic: "ADI", opcode: "C6" },
        { mnemonic: "SUB B", opcode: "90" }, { mnemonic: "SUI", opcode: "D6" },
        { mnemonic: "INR B", opcode: "04" }, { mnemonic: "DCR C", opcode: "0D" },
        { mnemonic: "INX D", opcode: "13" }, { mnemonic: "DCX H", opcode: "2B" },
        { mnemonic: "CMP B", opcode: "B8" }, { mnemonic: "ANA C", opcode: "A1" },
        { mnemonic: "XRA D", opcode: "AA" }, { mnemonic: "ORA E", opcode: "B3" },
        { mnemonic: "CMA", opcode: "2F" }, { mnemonic: "JMP", opcode: "C3" },
        { mnemonic: "JC", opcode: "DA" }, { mnemonic: "JNC", opcode: "D2" },
        { mnemonic: "JZ", opcode: "CA" }, { mnemonic: "JNZ", opcode: "C2" },
        { mnemonic: "CALL", opcode: "CD" }, { mnemonic: "RET", opcode: "C9" },
        { mnemonic: "PUSH B", opcode: "C5" }, { mnemonic: "POP D", opcode: "D1" },
        { mnemonic: "HLT", opcode: "76" }, { mnemonic: "NOP", opcode: "00" },
        { mnemonic: "DI", opcode: "F3" }, { mnemonic: "EI", opcode: "FB" },
        { mnemonic: "OUT", opcode: "D3" }, { mnemonic: "IN", opcode: "DB" },
        { mnemonic: "RIM", opcode: "20" }, { mnemonic: "SIM", opcode: "30" },
        { mnemonic: "LXI B", opcode: "01" }, { mnemonic: "LXI D", opcode: "11" },
        { mnemonic: "LXI H", opcode: "21" }, { mnemonic: "LXI SP", opcode: "31" },
        { mnemonic: "SHLD", opcode: "22" }, { mnemonic: "LHLD", opcode: "2A" },
        { mnemonic: "STAX B", opcode: "02" }, { mnemonic: "LDAX D", opcode: "1A" },
        { mnemonic: "DAD B", opcode: "09" }, { mnemonic: "XCHG", opcode: "EB" }
    ];

    const lines = mnemonics.split('\n');
    let address = startAddress;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return;

        const resultDiv = document.createElement('div');
        resultDiv.classList.add('p-4', 'rounded-md', 'shadow-sm', 'transition', 'duration-300', 'transform', 'hover:scale-105', 'bg-gray-100', 'text-gray-800');

        const spaceIndex = trimmedLine.indexOf(' ');
        let mnemonic = trimmedLine;
        let operand = '';

        if (spaceIndex !== -1) {
            mnemonic = trimmedLine.substring(0, spaceIndex);
            operand = trimmedLine.substring(spaceIndex + 1);

            if (isNaN(operand)) {
                mnemonic = trimmedLine;
                operand = '';
            }
        }

        const lookup = lookupTable.find(item => item.mnemonic === mnemonic);
        if (lookup) {
            resultDiv.innerHTML = `<strong>Mnemonic:</strong> ${lookup.mnemonic}, <strong>Address:</strong> ${address}, <strong>Opcode:</strong> ${lookup.opcode}`;
            address += 1;

            resultsContainer.appendChild(resultDiv);

            if (operand) {
                if (/^\d{4}$/.test(operand)) {
                    const firstTwoDigits = operand.substring(0, 2);
                    const lastTwoDigits = operand.substring(2, 4);

                    const addressDiv1 = document.createElement('div');
                    addressDiv1.classList.add('p-4', 'rounded-md', 'shadow-sm', 'bg-blue-100', 'text-blue-800', 'transition', 'duration-300', 'transform', 'hover:scale-105');
                    addressDiv1.innerHTML = `<strong>Address:</strong> ${address}, <strong>Value:</strong> ${lastTwoDigits} (last two digits)`;
                    address += 1;

                    const addressDiv2 = document.createElement('div');
                    addressDiv2.classList.add('p-4', 'rounded-md', 'shadow-sm', 'bg-blue-100', 'text-blue-800', 'transition', 'duration-300', 'transform', 'hover:scale-105');
                    addressDiv2.innerHTML = `<strong>Address:</strong> ${address}, <strong>Value:</strong> ${firstTwoDigits} (first two digits)`;
                    address += 1;

                    resultsContainer.appendChild(addressDiv1);
                    resultsContainer.appendChild(addressDiv2);
                } else {
                    resultDiv.innerHTML += `<br><strong>Error:</strong> Invalid address '${operand}'. Must be a 4-digit number.`;
                    resultDiv.classList.remove('bg-gray-100', 'text-gray-800');
                    resultDiv.classList.add('bg-red-100', 'text-red-800');
                }
            }
        } else {
            resultDiv.innerHTML = `<strong>Line ${index + 1}:</strong> Error - Invalid mnemonic '${mnemonic}'`;
            resultDiv.classList.add('bg-red-100', 'text-red-800');
            resultsContainer.appendChild(resultDiv);
        }
    });
});
