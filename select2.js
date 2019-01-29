// select2
        $.fn.select2.amd.define('select2/data/extended-ajax',['./ajax','../utils','jquery'],
        function(AjaxAdapter, Utils, $){
            function ExtendedAjaxAdapter ($element,options) {
                //we need explicitly process minimumInputLength value
                //to decide should we use AjaxAdapter or return defaultResults,
                //so it is impossible to use MinimumLength decorator here
                this.minimumInputLength = options.get('minimumInputLength');
                this.defaultResults     = options.get('defaultResults');
                ExtendedAjaxAdapter.__super__.constructor.call(this,$element,options);
            }
            Utils.Extend(ExtendedAjaxAdapter,AjaxAdapter);
            //override original query function to support default results
            var originQuery = AjaxAdapter.prototype.query;
            ExtendedAjaxAdapter.prototype.query = function (params, callback) {
                var defaultResults = (typeof this.defaultResults == 'function') ? this.defaultResults.call(this) : this.defaultResults;
                if (defaultResults && defaultResults.length && (!params.term || params.term.length < this.minimumInputLength)){
                var processedResults = this.processResults(defaultResults,params.term);
                callback(processedResults);
                }else {
                originQuery.call(this, params, callback);
                }
            };
            return ExtendedAjaxAdapter;
        });

        $("#reporterId").select2({
            ajax: {
                url: "{$admin_file}",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                        return {
                            task: 'result',
                            action: 'get_reporter',
                            q: params.term, // search term
                            page: params.page
                        };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data.items,
                            pagination: {
                            more: (params.page * 20) < data.total_count,

                        }
                    };
                },
                cache: true
            },

            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            minimumInputLength: 3,
            placeholder: "Select Reporter",
            dataAdapter: $.fn.select2.amd.require('select2/data/extended-ajax')
        });

        $('#reporterId').on('select2:select', function (e) {
            var selected_element_id = e.params.data.id;
            var selected_element_mongo_id = e.params.data.mongo_id;
            // var select_val = selected_element.val();
            console.log(selected_element_id);
            console.log(selected_element_mongo_id);
            $('#mongo_reporter_id').val(selected_element_mongo_id);
            $('#reporter_id').val(selected_element_id);
            // alert(select_val);
            // window.parent.location.replace('{$index_file}?task=main&idx='+select_val);
            // parent.jQuery.colorbox.close();
        });

    });
    // end select2



//php


	// action for select2
	if ('get_reporter' === $action) {
		//search data
			$limit = 20;
			$page = empty($_GET['page']) ? 1 : $_GET['page'];
			$kwd  = empty($_GET['q']) ? '' : $_GET['q'];

			$offset = ($page - 1) * $limit;

			$total_data = 0;
			$datas = fetch_multi_row($kwd,  $limit);
			if(count($datas) > 0) $total_data = $datas[0]['total'];
			$items = array();
			foreach($datas AS $data)
			{
			$text = $data["username"];
			$items[] = array('id' => $data["id"], 'mongo_id' => $data["mongo_id"], 'text' => $text);
			}
			header('Content-type: application/json');
			echo json_encode(array('items' => $items, 'total_count' => $total_data));
			exit;
	}
	// end action for select2 
