const TodoModel=require('../model/TodoModel')


exports.create=async(req,res)=>{
    try{
        let email=req.headers["email"];
        let reqBody=req.body;
        reqBody.email=email;
        await TodoModel.create(reqBody)
        res.json({stats:"Success",message:"Todo Created Successfully"})
    
    
    }catch(err){
        res.json({stats:"Fail",message:err})
    }
    }

    exports.update = async (req, res) => {
        try {
            let email = req.headers["email"];
            let { id } = req.params;
            let reqBody = req.body;
            const todo = await TodoModel.findOne({ _id: id, email: email });
    
            if (!todo) {
                return res.status(404).json({ status: "Fail", message: "Todo not found or does not belong to the user" });
            }
            await TodoModel.updateOne({ _id: id, email: email }, reqBody);
    
            res.json({ status: "Success", message: "Todo updated successfully" });
        } catch (err) {
            res.status(500).json({ status: "Fail", message: err.message });
        }
    }
    

exports.read=async(req,res)=>{
            try{
                let email=req.headers["email"];
          let data=  await TodoModel.find({email:email})

                res.json({stats:"Success",data:data})
            
            
            }catch(err){
                res.json({stats:"Fail",message:err})
            }
            }
exports.delete = async (req, res) => {
    try {
        let email = req.headers["email"];
        let { id } = req.params;
        const todo = await TodoModel.findOne({ _id: id, email: email });
        if (!todo) {
        return res.status(404).json({ status: "Fail", message: "Todo not found or does not belong to the user" });
         }
        await TodoModel.deleteOne({ _id: id, email: email });
            
        res.json({ status: "Success", message: "Todo deleted successfully" });
        } catch (err) {
        res.status(500).json({ status: "Fail", message: err.message });
        }
    }
            

exports.complete = async (req, res) => {
        try {
            let email = req.headers["email"];
            let { id } = req.params;
            const todo = await TodoModel.findOne({ _id: id, email: email });
            if (!todo) {
                return res.status(404).json({ status: "Fail", message: "Todo not found or does not belong to the user" });
            }
            await TodoModel.updateOne({ _id: id, email: email }, { status: "Complete" });
    
            res.json({ status: "Success", message: "Todo marked as complete" });
        } catch (err) {
            res.status(500).json({ status: "Fail", message: err.message });
        }
    }
    
    exports.cancel = async (req, res) => {
        try {
            let email = req.headers["email"];
            let { id } = req.params;
            const todo = await TodoModel.findOne({ _id: id, email: email });
    
            if (!todo) {
                return res.status(404).json({ status: "Fail", message: "Todo not found or does not belong to the user" });
            }
            await TodoModel.updateOne({ _id: id, email: email }, { status: "Cancel" });
    
            res.json({ status: "Success", message: "Todo marked as canceled" });
        } catch (err) {
            res.status(500).json({ status: "Fail", message: err.message });
        }
    }
    