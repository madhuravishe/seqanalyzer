let contentChart; // Declare the chart variable globally
let contentBarChart; // Declare Bar Chart variable globally

function getComplement() {
    let dnaSequence = document.getElementById("dnaInput").value.toUpperCase();

    // Validate input
    if (!dnaSequence.match(/^[ATGC]+$/)) {
        alert("Please enter a valid DNA sequence (A, T, G, C only).");
        return;
    }

    // Generate Complementary Sequence
    let complement = dnaSequence
        .replace(/A/g, "t")
        .replace(/T/g, "a")
        .replace(/C/g, "g")
        .replace(/G/g, "c")
        .toUpperCase();

    // Calculate Statistics
    let length = dnaSequence.length;
    let countA = (dnaSequence.match(/A/g) || []).length;
    let countT = (dnaSequence.match(/T/g) || []).length;
    let countG = (dnaSequence.match(/G/g) || []).length;
    let countC = (dnaSequence.match(/C/g) || []).length;

    let gcContent = ((countG + countC) / length) * 100;
    let atContent = ((countA + countT) / length) * 100;

    // Display Results
    document.getElementById("complementResult").innerText = complement;
    document.getElementById("DnaLength").innerText = length;
    document.getElementById("gcContent").innerText = gcContent.toFixed(2) + "%";
    document.getElementById("atContent").innerText = atContent.toFixed(2) + "%";
    document.getElementById("countA").innerText = countA;
    document.getElementById("countT").innerText = countT;
    document.getElementById("countG").innerText = countG;
    document.getElementById("countC").innerText = countC;

    // Destroy previous chart instance if it exists
    if (contentChart) {
        contentChart.destroy();
    }
    if (contentBarChart) {
        contentBarChart.destroy();
    }

    // Create Pie Chart for A, T, G, C count
    let ctxPie = document.getElementById("contentChart").getContext("2d");
    contentChart = new Chart(ctxPie, {
        type: "pie",
        data: {
            labels: ["A", "T", "G", "C"],
            datasets: [
                {
                    data: [countA, countT, countG, countC],
                    backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Create Bar Chart for GC & AT Content
    let ctxBar = document.getElementById("gcAtChart").getContext("2d");
    contentBarChart = new Chart(ctxBar, {
        type: "bar",
        data: {
            labels: ["AT Content", "GC Content"],
            datasets: [
                {
                    label: "Percentage",
                    data: [atContent, gcContent],
                    backgroundColor: ["#ff9999", "#66b3ff"]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}



// Function to update the AT/GC content chart
function updateContentChart(atContent, gcContent) {
    let ctx = document.getElementById("contentChart").getContext("2d");

    if (window.contentChartInstance) {
        window.contentChartInstance.destroy();
    }

    window.contentChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["AT Content", "GC Content"],
            datasets: [{
                label: "Content Percentage",
                data: [atContent, gcContent],
                backgroundColor: ["#ff6384", "#36a2eb"],
                borderColor: ["#ff4c68", "#2980b9"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}


function transcribeDNA() {
    let dna = document.getElementById("DnaSequence").value.toUpperCase().trim();

    if (!/^[ATGC]+$/.test(dna)) {
        alert("Invalid DNA sequence. Only A, T, G, and C are allowed.");
        return;
    }

    // DNA to mRNA (T → U)
    let mrna = dna.replace(/T/g, "U");

    // mRNA to tRNA (A ↔ U, U ↔ A, C ↔ G, G ↔ C)
    let trna = mrna.replace(/A/g, "X")  // Temporarily replace A with X
                   .replace(/U/g, "A")  // Replace U with A
                   .replace(/X/g, "U")  // Replace temporary X (original A) with U
                   .replace(/G/g, "Y")  // Temporarily replace G with Y
                   .replace(/C/g, "G")  // Replace C with G
                   .replace(/Y/g, "C"); // Replace temporary Y (original G) with C

    document.getElementById("mrnaResult").innerText = ` ${mrna}`;
    document.getElementById("trnaResult").innerText = ` ${trna}`;
}


function showLoader() {
    let loaderContainer = document.getElementById("loader-container");
    let progressBar = document.getElementById("progress-bar");

    loaderContainer.style.display = "block"; // Show loader
    progressBar.style.width = "0%"; // Reset progress

    let progress = 0;
    let interval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(interval);
            hideLoader();
        } else {
            progress += 20;
            progressBar.style.width = progress + "%";
        }
    }, 400);
}

function hideLoader() {
    setTimeout(() => {
        document.getElementById("loader-container").style.display = "none";
    }, 1000);
}


function analyzeSequence() {
    let inputSequence = document.getElementById("sequence").value.toUpperCase().trim();

    if (!/^[ABCDEFGHIJKLMNOPQRSTUVWXYZ]+$/.test(inputSequence)) {
        alert("Invalid DNA sequence. Only A, T, G, and C are allowed.");
        return;
    }

    // Remove all line breaks and extra spaces
    inputSequence = inputSequence.replace(/\s+/g, ''); 

    // Display the formatted sequence
    document.getElementById("sequence").value = inputSequence;

    // Disease dictionary
    const diseaseLibrary = {
    
        "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVLWVDTPPPTRVRMAIYQSQHTEVVRCPHERCSSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD": "cellular tumor antigen",
        "MAPWMHLLTVLALLALWGPNSVQAYSSQHLCGSNLVEALYMTCGRSGFYRPHDRRELEDLQVEQAELGLEAGGLQPSALEMILQKRGIVDQCCNNICTFNQLQNYCNVP": "insulin[octodon degus]",
        "AMADYDTYVSNVQINNLSYGVYTSGGKETQFFCIGLKHGSEAISINAMCKVDVYGNHKQGFDNMLNTAKYYYTTGGDVRIYYKENVWRDPDFKSAFSSRELIAITTCSSSSYCMGPTVTNLESD": "chainE, subtilase cytotoxin sununitB-like protein",
        "MSYSMCTGKFKVVKEIAETQHGTIVIRVQYEGDGSPCKIPFEIMDLEKRHVLGRLITVNPIVTEKDSPVNIEAEPPFGDSYIIIGVEPGQLKLNWFKK":"chain I ,DomainIII of dengue virus 2",
        "MDADKIVFKVNNQVVSLKPEIIVDQYEYKYPAIKDLKKPSITLGKAPDLNKAYKSVLSGLNAAKLDPDDVCSYLAAAMQFFEGTCPDWTSGILIRKGDITPDSLVEIKRTDVEGNWALTGGMELTRDPT": "nucleoprotein, partial[Lyssavirus rabies]",
        "NNENQTKVSKSAFVPNMSLD":"outer membrane protein,partial[Chlamydia trachomatis]",
        "MAQKSNIKPIISLKTVFGRDDNDLRETELD":"[Caudoviricetes sp.]",
        "PISPIETVPVKLKPGMDGPKVKQWPLTEEKIKALVEICTEMEKEGKISKIGPENPYNTPVFAIKKKDSTKWRKLVDFRELNKRTQDFWEVQLGIPHPAGLKKKKSVTILDVGDAYFSVPLDEDFRKYTAFTIPSINNETPGIRQYNVPQGWGSPAFQSSTKILPFRKNPDIIYQYDDLYVGSDLEIGQHRTKIEELRQHLLRWGLTTPDKKHQKEPPFLWMGYELHPDKWTVQPIVLPEKDSWTVNDIQKLVGKLNWASQIYPGIKVRQLXKLLRGTKALTEVIPLTEEAELELAENREILKEPVHGVYYDPSKDLIAEIQKQGQGQWTYQIYQEPFKNLKTGKYARMRGAHTNDVKQLTEAVQKITTESIVIWGKTPKFKLPIQKETWETWWTEYWQATWIPEWEFVNTPPLVKLWYQLEKEPIVGAETFYVDGAANRETKLGKAGYVTNRGRQKVVTLTDTTNQKTELQAIYLALQDSGLEVNIVTDSQYALGIIQAQPDQSESELVNQIIEQLIKKEKVYLAWVPAHKGIGGNEQVDKLVSAGIRKVL":"Chain A, reserve transcriptase",
        "IVGGRRARPHAWPFMVSLQLRGGHFCGATLIAPNFVMSAAHCVANVNVRAVRVVLGAHNLSRREPTRQVFAVQRIFENGYDPVNLLNDIVILQLNGSATINANVQVAQLPAQGRRLGNGVQCLAMGWGLLGRNRGIASVLQELNTVVTLCRRNVCTVRGRAGVCGDSGPLVCGLIHGIASFVRGGCASGLYPDAFAPVAQFVNWIDSIIX":"Chain E, human leukocuty elastase",
        "MMCQKFYVVLLHWEFLYVIAALNLAYPISPWKFKLFCGPPNTTDDSFLSPAGAPNNASALKGASEAIVEAKFNSSGIYVPELSKTVFHCCFGNEQGQNCSALTDNTEGKTLASVVKASVFRQLGVNWDIECWMKGDLTLFYLETSAGSFQSLMSLPMLVKPDPLGLHEVTDGNLKISWDSQTMAPSPLQYQVKYLENSTIVREAAEIVSATSLLVDSVLPGSSYEVQVRSKRLDGSGVWSDWSSPQVFTTQDVVYFPPKILTSVGSNASFHCIYKNENQIISSKQIVWWRNLAEKIPEIQYSIVSDRVSKVTFSNLKATRPRGKFTYDAVYCCNEQACHHRYAELYVIDVNINISCETDGYLTKMTCRWSPSTIQSLVGSTVQLRYHRRSLYCPDSPSIHPTSEPKNCVLQRDGFYECVFQPIFLLSGYTMWIRINHSLGSLDSPPTCVLPDSVVKPLPPSNVKAEITVNTGLLKVSWEKPVFPENNLQFQIRYGLSGKEIQWKTHEVFDAKSKSASLLVSDLCAVYVVQVRCRRLDGLGYWSNWSSPAYTLVMDVKVPMRGPEFWRKMDGDVTFSWPMSKVSAVESLSAYPLSSSCVILSWTLSPDDYSLLYLVIEWKILNEDDGMKWLRIPSNVKKFYIHDNFIPIEKYQFSLYPVFMEGVGKPKIINGFTKDAIDKQQNDAGLYVIVPIIISSCVLLLGTLLISHQRMKKLFWDDVPNPKNCSWAQGLNFQKRTDTL": "Lepr protein [Mus musculus]",  
        
    };

    let foundDisease = "No disease found";
    for (let seq in diseaseLibrary) {
        if (inputSequence.includes(seq)) {
            foundDisease = `Genetic Disease: ${diseaseLibrary[seq]}`;
            break;
        }
    }

    // Display result
    document.getElementById("result").innerText = foundDisease;
}